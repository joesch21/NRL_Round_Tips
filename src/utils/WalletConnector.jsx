import { ethers } from "ethers";

export const connectWallet = async () => {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return signer.address;
  } else {
    alert("Please install MetaMask.");
    return null;
  }
};

export const getCurrentAccount = async () => {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.listAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }
  return null;
};
