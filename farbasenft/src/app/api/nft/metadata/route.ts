import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { erc721Abi } from "viem";
import { fetchNFTMetadata } from "@/lib/tatum";

/**
 * API route for fetching NFT metadata
 * GET /api/nft/metadata?contract=0x...&tokenId=123
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contractAddress = searchParams.get("contract");
    const tokenId = searchParams.get("tokenId");

    if (!contractAddress || !tokenId) {
      return NextResponse.json(
        { error: "Contract address and token ID are required" },
        { status: 400 },
      );
    }

    // Try Tatum API first if available
    if (process.env.TATUM_API_KEY) {
      try {
        const tatumMetadata = await fetchNFTMetadata("base", contractAddress, tokenId);
        if (tatumMetadata) {
          return NextResponse.json({
            name: tatumMetadata.name,
            description: tatumMetadata.description,
            image: tatumMetadata.image,
            attributes: tatumMetadata.attributes || [],
            external_url: tatumMetadata.external_url,
            source: "tatum",
          });
        }
      } catch (tatumError) {
        console.log("Tatum API failed, falling back to direct contract read:", tatumError);
      }
    }

    // Fallback to direct contract read
    const publicClient = createPublicClient({
      chain: base,
      transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    });

    // Fetch token URI from contract
    const tokenURI = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: erc721Abi,
      functionName: "tokenURI",
      args: [BigInt(tokenId)],
    });

    if (!tokenURI) {
      return NextResponse.json(
        { error: "Token URI not found" },
        { status: 404 },
      );
    }

    // Fetch metadata from IPFS/HTTP
    let metadataUrl = tokenURI;
    if (tokenURI.startsWith("ipfs://")) {
      metadataUrl = `https://gateway.pinata.cloud/ipfs/${tokenURI.replace("ipfs://", "")}`;
    }

    const metadataResponse = await fetch(metadataUrl);
    if (!metadataResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch metadata" },
        { status: 404 },
      );
    }

    const metadata = await metadataResponse.json();

    // Resolve image URL if it's IPFS
    let imageUrl = metadata.image;
    if (imageUrl?.startsWith("ipfs://")) {
      imageUrl = `https://gateway.pinata.cloud/ipfs/${imageUrl.replace("ipfs://", "")}`;
    }

    return NextResponse.json({
      name: metadata.name,
      description: metadata.description,
      image: imageUrl || metadata.image,
      attributes: metadata.attributes || [],
      external_url: metadata.external_url,
      source: "contract",
    });
  } catch (error) {
    console.error("NFT metadata fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch NFT metadata",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

