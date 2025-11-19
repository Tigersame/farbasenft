import { NextRequest, NextResponse } from 'next/server';
import { uploadJSONToPinata } from '@/lib/pinata';

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

    // Upload file to Pinata
    const fileFormData = new FormData();
    fileFormData.append('file', file);

    const PINATA_JWT = process.env.PINATA_JWT;
    if (!PINATA_JWT) {
      return NextResponse.json({ error: 'Pinata JWT not configured' }, { status: 500 });
    }

    const fileResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: fileFormData,
    });

    if (!fileResponse.ok) {
      const errorText = await fileResponse.text();
      throw new Error('Pinata file upload failed: ' + errorText);
    }

    const fileData = await fileResponse.json();
    const mediaCid = fileData.IpfsHash;

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

    // Upload metadata to Pinata
    const metadataResponse = await uploadJSONToPinata(metadata);
    const metaCid = metadataResponse.IpfsHash;

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
