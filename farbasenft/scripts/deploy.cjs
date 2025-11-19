const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying FarbaseNFT contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const FarbaseNFT = await ethers.getContractFactory("FarbaseNFT");
  const nft = await FarbaseNFT.deploy();

  await nft.waitForDeployment();

  const address = await nft.getAddress();
  console.log("FarbaseNFT deployed to:", address);
  console.log("\nAdd this to your .env.local:");
  console.log(`NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${address}`);
  console.log("\nVerify with:");
  console.log(`npx hardhat verify --network baseSepolia ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
