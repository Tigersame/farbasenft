import { ethers } from "hardhat";

async function main() {
  console.log("🎖️ Deploying FarcasterNFT SBT Contract...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📍 Deployer address:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  if (parseFloat(ethers.formatEther(balance)) < 0.005) {
    console.warn("⚠️  Warning: Low balance. Ensure you have enough ETH for gas.\n");
  }

  console.log("🔨 Compiling contract...");
  const SBT = await ethers.getContractFactory("FarcasterNFTSBT");
  
  console.log("🚀 Deploying contract...");
  
  // Deploy with owner address and base metadata URI
  const baseURI = "ipfs://QmYourMetadataHash/"; // Change to your actual IPFS hash
  const sbt = await SBT.deploy(deployer.address, baseURI);

  await sbt.waitForDeployment();

  const address = await sbt.getAddress();
  console.log("\n✅ SBT Contract deployed successfully!\n");
  console.log("📋 Contract Address:", address);
  console.log("🌐 Base Sepolia Etherscan: https://sepolia.basescan.org/address/" + address);
  console.log("🌐 Base Mainnet Etherscan: https://basescan.org/address/" + address);

  console.log("\n📝 Add this to your .env.local:\n");
  console.log(`NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=${address}`);

  console.log("\n🔐 Next steps:\n");
  console.log("1. Update .env.local with the contract address above");
  console.log("2. Restart your dev server: npm run dev");
  console.log("3. Test the SBT claim feature in the app");
  console.log("4. (Optional) Verify on Etherscan:");
  console.log(`   npx hardhat verify --network base ${address} ${deployer.address} "${baseURI}"`);

  console.log("\n💡 To deploy to different networks, use:");
  console.log("   npx hardhat run scripts/deploy-sbt.ts --network baseSepolia");
  console.log("   npx hardhat run scripts/deploy-sbt.ts --network base");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
