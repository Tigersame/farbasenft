/**
 * Pinata IPFS utility functions for uploading NFT metadata and images
 */

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const PINATA_JWT = process.env.PINATA_JWT;

const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";
const PINATA_API_URL = "https://api.pinata.cloud";

export interface PinataMetadata {
  name?: string;
  keyvalues?: Record<string, string>;
}

export interface PinataOptions {
  pinataMetadata?: PinataMetadata;
  pinataOptions?: {
    cidVersion?: number;
    wrapWithDirectory?: boolean;
  };
}

/**
 * Upload JSON metadata to Pinata/IPFS
 */
export async function uploadJSONToPinata(
  json: Record<string, unknown>,
  options?: PinataOptions,
): Promise<{ IpfsHash: string; PinSize: number; Timestamp: string }> {
  if (!PINATA_JWT) {
    throw new Error("PINATA_JWT is not configured");
  }

  const formData = new FormData();
  const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
  formData.append("file", blob, "metadata.json");

  if (options?.pinataMetadata) {
    formData.append("pinataMetadata", JSON.stringify(options.pinataMetadata));
  }

  if (options?.pinataOptions) {
    formData.append("pinataOptions", JSON.stringify(options.pinataOptions));
  }

  const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinata upload failed: ${error}`);
  }

  return response.json();
}

/**
 * Upload file (image) to Pinata/IPFS
 */
export async function uploadFileToPinata(
  file: File | Blob,
  filename: string,
  options?: PinataOptions,
): Promise<{ IpfsHash: string; PinSize: number; Timestamp: string }> {
  if (!PINATA_JWT) {
    throw new Error("PINATA_JWT is not configured");
  }

  const formData = new FormData();
  formData.append("file", file, filename);

  if (options?.pinataMetadata) {
    formData.append("pinataMetadata", JSON.stringify(options.pinataMetadata));
  }

  if (options?.pinataOptions) {
    formData.append("pinataOptions", JSON.stringify(options.pinataOptions));
  }

  const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinata upload failed: ${error}`);
  }

  return response.json();
}

/**
 * Get IPFS URL from hash
 */
export function getIPFSUrl(hash: string): string {
  return `${PINATA_GATEWAY}${hash}`;
}

/**
 * Create NFT metadata JSON following ERC-721 standard
 */
export function createNFTMetadata(params: {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: Array<{ trait_type: string; value: string | number }>;
}): Record<string, unknown> {
  return {
    name: params.name,
    description: params.description,
    image: params.image,
    external_url: params.external_url,
    attributes: params.attributes || [],
  };
}

