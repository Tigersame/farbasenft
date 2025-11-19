import { NextRequest, NextResponse } from "next/server";
import { uploadJSONToPinata, uploadFileToPinata } from "@/lib/pinata";

/**
 * API route for uploading files and JSON to Pinata/IPFS
 * POST /api/ipfs/upload
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Pinata is configured
    if (!process.env.PINATA_JWT) {
      return NextResponse.json(
        {
          error: "IPFS upload not configured",
          message: "PINATA_JWT environment variable is not set. Please configure Pinata credentials in your .env.local file.",
          details: "See https://docs.pinata.cloud/ for setup instructions",
        },
        { status: 503 }, // Service Unavailable
      );
    }

    const contentType = request.headers.get("content-type");
    
    // Handle JSON metadata upload
    if (contentType?.includes("application/json")) {
      const body = await request.json();
      if (body.json) {
        const result = await uploadJSONToPinata(body.json);
        return NextResponse.json({
          success: true,
          IpfsHash: result.IpfsHash,
          ipfsHash: result.IpfsHash,
          ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
          pinSize: result.PinSize,
          timestamp: result.Timestamp,
        });
      }
    }
    
    // Handle file upload (FormData)
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 },
      );
    }

    const result = await uploadFileToPinata(file, file.name);

    return NextResponse.json({
      success: true,
      IpfsHash: result.IpfsHash,
      ipfsHash: result.IpfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      pinSize: result.PinSize,
      timestamp: result.Timestamp,
    });
  } catch (error) {
    console.error("IPFS upload error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Provide more helpful error messages
    let status = 500;
    let message = errorMessage;
    
    if (errorMessage.includes("PINATA_JWT is not configured")) {
      status = 503;
      message = "IPFS upload is not configured. Please add PINATA_JWT to your .env.local file.";
    } else if (errorMessage.includes("Pinata upload failed")) {
      message = `Pinata API error: ${errorMessage}`;
    }
    
    return NextResponse.json(
      {
        error: "Upload failed",
        message,
        details: errorMessage,
      },
      { status },
    );
  }
}

