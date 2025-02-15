import { ethers } from "ethers";

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

// ✅ Function to check if connected to BSC Testnet
const checkNetwork = async () => {
  try {
    if (!window.ethereum) throw new Error("MetaMask is not installed");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();

    if (network.chainId !== 97) { // 97 = BSC Testnet
      await switchToTestnet();
      return false;
    }
    return true;
  } catch (error) {
    console.error("Network check error:", error);
    return false;
  }
};

// ✅ Function to switch network to BSC Testnet
const switchToTestnet = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }] // 0x61 = 97 in hex (BSC Testnet)
    });
  } catch (switchError) {
    console.error("Network switch error:", switchError);
    if (switchError.code === 4902) {
      // Chain not found, add it
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x61",
            chainName: "Binance Smart Chain Testnet",
            nativeCurrency: {
              name: "BNB",
              symbol: "tBNB",
              decimals: 18
            },
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
            blockExplorerUrls: ["https://testnet.bscscan.com/"]
          }
        ]
      });
    }
  }
};

// 🚀 Mint NFT Function (with Testnet Check)
const mintNFT = async (predictions, account) => {
  try {
    const isTestnet = await checkNetwork();
    if (!isTestnet) {
      alert("Please switch to Binance Smart Chain Testnet to continue.");
      return { success: false, error: "Wrong network" };
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Convert predictions to JSON metadata (DIRECT to blockchain)
    const metadata = JSON.stringify({
      name: "Round 1",
      description: "Selections for Round 1",
      predictions
    });

    // Send transaction on Testnet only
    const tx = await contract.mintNFT(metadata, { value: ethers.parseEther("0.01") });
    await tx.wait();
    
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Minting error:", error);
    return { success: false, error: error.message };
  }
};

export default mintNFT;
