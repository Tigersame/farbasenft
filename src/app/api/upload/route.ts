import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToPinata } from '@/lib/pinata';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to blob (File already extends Blob, but let's be explicit)
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });

    // Upload to Pinata
    const result = await uploadFileToPinata(blob, file.name);
    const url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;

    return NextResponse.json({ 
      success: true, 
      url,
      ipfsHash: result.IpfsHash 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
