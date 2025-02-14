import { ethers } from "ethers";
import { MetaMaskSDK } from "@metamask/sdk";

const BSC_TESTNET_CHAIN_ID = "0x61"; // BNB Smart Chain Testnet

// 🔗 Initialize MetaMask SDK for Mobile & Desktop Support
const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "NRL Round Tips",
    url: "https://nrl-round-tips.vercel.app/", // Change to your live URL
  },
  checkInstallationImmediately: false,
});

const ethereum = MMSDK.getProvider() || window.ethereum; // Fallback to window.ethereum

// 🔗 Ensure the user is on BSC Testnet
const checkNetwork = async () => {
  if (!ethereum) return false;

  try {
    const provider = new ethers.BrowserProvider(ethereum);
    const network = await provider.getNetwork();

    if (network.chainId !== parseInt(BSC_TESTNET_CHAIN_ID, 16)) {
      try {
        await ethereum.request({
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
  } catch (error) {
    console.error("Error checking network", error);
    return false;
  }
};

// 🔗 Connect Wallet (With Deeplinking for Mobile)
export const connectWallet = async () => {
  if (!ethereum) {
    alert("MetaMask not detected. Please install MetaMask and try again.");
    window.open("https://metamask.io/download/", "_blank");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(ethereum);

    // 🔍 Check if using MetaMask's in-app browser (No deeplink needed)
    const isMetaMaskMobile = /MetaMask/i.test(navigator.userAgent);
    
    if (window.innerWidth < 768 && !isMetaMaskMobile) {
      // 📲 Mobile: Use Deep Linking
      window.open(`https://metamask.app.link/dapp/${window.location.hostname}`, "_blank");
      return null;
    }

    // 🔗 Request wallet connection
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
  if (!ethereum) return null;

  try {
    const provider = new ethers.BrowserProvider(ethereum);
    const accounts = await provider.listAccounts();

    if (accounts.length === 0) return null;

    const isCorrectNetwork = await checkNetwork();
    return isCorrectNetwork ? accounts[0] : null;
  } catch (error) {
    console.error("Error fetching account", error);
    return null;
  }
};
