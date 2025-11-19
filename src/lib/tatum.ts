/**
 * Tatum API integration for NFT data
 * Tatum provides blockchain infrastructure and NFT APIs
 * 
 * API Key: Set in TATUM_API_KEY environment variable
 * Documentation: https://docs.tatum.io/
 */

const TATUM_API_KEY = process.env.TATUM_API_KEY;
const TATUM_API_URL = "https://api.tatum.io/v3";

export interface TatumNFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{ trait_type: string; value: string | number }>;
  external_url?: string;
}

export interface TatumNFT {
  contractAddress: string;
  tokenId: string;
  metadataURI?: string;
  metadata?: TatumNFTMetadata;
}

/**
 * Fetch NFT metadata using Tatum API
 * @param chain - Blockchain network (e.g., 'base', 'ethereum')
 * @param contractAddress - NFT contract address
 * @param tokenId - Token ID
 */
export async function fetchNFTMetadata(
  chain: string,
  contractAddress: string,
  tokenId: string
): Promise<TatumNFTMetadata | null> {
  if (!TATUM_API_KEY) {
    console.warn("TATUM_API_KEY not configured");
    return null;
  }

  try {
    const response = await fetch(
      `${TATUM_API_URL}/nft/metadata/${chain}/${contractAddress}/${tokenId}`,
      {
        headers: {
          "x-api-key": TATUM_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Tatum API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Tatum NFT metadata fetch error:", error);
    return null;
  }
}

/**
 * Get NFT balance for an address
 * @param chain - Blockchain network
 * @param address - Wallet address
 * @param contractAddress - Optional NFT contract address filter
 */
export async function getNFTBalance(
  chain: string,
  address: string,
  contractAddress?: string
): Promise<TatumNFT[]> {
  if (!TATUM_API_KEY) {
    console.warn("TATUM_API_KEY not configured");
    return [];
  }

  try {
    const url = contractAddress
      ? `${TATUM_API_URL}/nft/balance/${chain}/${address}/${contractAddress}`
      : `${TATUM_API_URL}/nft/balance/${chain}/${address}`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": TATUM_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Tatum API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Tatum NFT balance fetch error:", error);
    return [];
  }
}

/**
 * Get NFT collection information
 * @param chain - Blockchain network
 * @param contractAddress - NFT contract address
 */
export async function getNFTCollection(
  chain: string,
  contractAddress: string
): Promise<any> {
  if (!TATUM_API_KEY) {
    console.warn("TATUM_API_KEY not configured");
    return null;
  }

  try {
    const response = await fetch(
      `${TATUM_API_URL}/nft/collection/${chain}/${contractAddress}`,
      {
        headers: {
          "x-api-key": TATUM_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Tatum API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Tatum NFT collection fetch error:", error);
    return null;
  }
}

