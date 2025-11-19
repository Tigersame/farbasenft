import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const attributesText = formData.get('attributes') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const projectId = process.env.INFURA_PROJECT_ID;
    const projectSecret = process.env.INFURA_PROJECT_SECRET;

    if (!projectId || !projectSecret) {
      return NextResponse.json({ error: 'Infura credentials not configured' }, { status: 500 });
    }

    // Upload file to Infura
    const fileFormData = new FormData();
    fileFormData.append('file', file);

    const auth = Buffer.from(`${projectId}:${projectSecret}`).toString('base64');
    const fileResponse = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
      },
      body: fileFormData,
    });

    if (!fileResponse.ok) {
      const errorText = await fileResponse.text();
      throw new Error('Infura file upload failed: ' + errorText);
    }

    const fileData = await fileResponse.json();
    const mediaCid = fileData.Hash;

    // Create metadata
    const metadata: any = {
      name: name || '',
      description: description || '',
      image: `ipfs://${mediaCid}`,
    };

    // Parse attributes if provided
    if (attributesText) {
      try {
        metadata.attributes = JSON.parse(attributesText);
      } catch (e) {
        console.error('Failed to parse attributes:', e);
      }
    }

    // Upload metadata to Infura
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const metadataFormData = new FormData();
    metadataFormData.append('file', metadataBlob, 'metadata.json');

    const metadataResponse = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
      },
      body: metadataFormData,
    });

    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();
      throw new Error('Infura metadata upload failed: ' + errorText);
    }

    const metadataData = await metadataResponse.json();
    const metaCid = metadataData.Hash;

    return NextResponse.json({
      tokenURI: `ipfs://${metaCid}`,
      ipfsCid: mediaCid,
      metadataCid: metaCid,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
