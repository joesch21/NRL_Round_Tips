import { ethers } from "ethers";
import { getLocalWallet } from "./LocalWallet";

const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545"); // BSC Testnet RPC
const contractAddress = "0xA6D5397e8a979225dfdC0d4E1E4Cf167d3f6b659";
const contractABI = [
  {
    "inputs": [{ "internalType": "string", "name": "metadataURI", "type": "string" }],
    "name": "mintNFT",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  }
];

// 🔹 Mint NFT Using Local Wallet
export const mintWithLocalWallet = async (predictions) => {
  const walletData = getLocalWallet();

  if (!walletData) {
    alert("No local wallet found! Please create one first.");
    return;
  }

  try {
    const wallet = new ethers.Wallet(walletData.privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    const metadataURI = JSON.stringify({
      name: "Round 1 Tips NFT",
      description: "User's predictions for Round 1 of NRL.",
      predictions,
    });

    const tx = await contract.mintNFT(metadataURI, { value: ethers.parseEther("0.01") });
    await tx.wait();

    alert("NFT Minted Successfully!");
  } catch (error) {
    console.error("Minting failed:", error);
    alert("Minting failed! See console for details.");
  }
};
