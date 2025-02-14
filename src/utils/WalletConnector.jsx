import { ethers } from "ethers";

const BSC_TESTNET_CHAIN_ID = "0x61"; // BNB Smart Chain Testnet

// 🔗 Ensure the user is on BSC Testnet
const checkNetwork = async () => {
  if (!window.ethereum) return false;

  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  if (network.chainId !== parseInt(BSC_TESTNET_CHAIN_ID, 16)) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BSC_TESTNET_CHAIN_ID }],
      });
      return true;
    } catch (switchError) {
      console.error("Network switch failed", switchError);
      alert("Please switch to Binance Smart Chain Testnet in MetaMask.");
      return false;
    }
  }
  return true;
};

// 🔗 Connect Wallet & Ensure Correct Network
export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("MetaMask not detected. Please install MetaMask and try again.");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const isCorrectNetwork = await checkNetwork();
    if (!isCorrectNetwork) return null;

    const signer = await provider.getSigner();
    return signer.address;
  } catch (error) {
    console.error("Wallet connection failed", error);
    alert(`Error connecting wallet: ${error.message}`);
    return null;
  }
};

// 🔗 Get Current Wallet Address (Auto-Reconnect)
export const getCurrentAccount = async () => {
  if (!window.ethereum) return null;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.listAccounts();
    
    if (accounts.length === 0) return null;

    const isCorrectNetwork = await checkNetwork();
    return isCorrectNetwork ? accounts[0] : null;
  } catch (error) {
    console.error("Error fetching account", error);
    return null;
  }
};
