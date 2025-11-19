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

    const key = process.env.FILEBASE_KEY;
    if (!key) {
      return NextResponse.json({ error: 'Filebase key not configured' }, { status: 500 });
    }

    // Upload file to Filebase
    const fileFormData = new FormData();
    fileFormData.append('file', file);

    const fileResponse = await fetch('https://api.filebase.io/v1/ipfs/pins', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
      },
      body: fileFormData,
    });

    if (!fileResponse.ok) {
      const errorText = await fileResponse.text();
      throw new Error('Filebase file upload failed: ' + errorText);
    }

    const fileData = await fileResponse.json();
    const mediaCid = fileData.requestid || fileData.cid || fileData.Hash;

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

    // Upload metadata to Filebase
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const metadataFormData = new FormData();
    metadataFormData.append('file', metadataBlob, 'metadata.json');

    const metadataResponse = await fetch('https://api.filebase.io/v1/ipfs/pins', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
      },
      body: metadataFormData,
    });

    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();
      throw new Error('Filebase metadata upload failed: ' + errorText);
    }

    const metadataData = await metadataResponse.json();
    const metaCid = metadataData.requestid || metadataData.cid || metadataData.Hash;

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
