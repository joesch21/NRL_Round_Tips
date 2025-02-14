import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";

const Wallet = ({ setWallet }) => {
  const [wallet, setLocalWallet] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [manualPrivateKey, setManualPrivateKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [encryptionPassword, setEncryptionPassword] = useState("");
  const [balance, setBalance] = useState("0");

  const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");

  const encryptPrivateKey = (privateKey, password) => {
    return CryptoJS.AES.encrypt(privateKey, password).toString();
  };

  const decryptPrivateKey = (encryptedKey, password) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedKey, password);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decryption failed", error);
      return null;
    }
  };

  useEffect(() => {
    const savedEncryptedKey = localStorage.getItem("localWallet");
    if (savedEncryptedKey && encryptionPassword) {
      try {
        const decryptedKey = decryptPrivateKey(savedEncryptedKey, encryptionPassword);
        if (decryptedKey) {
          const restoredWallet = new ethers.Wallet(decryptedKey);
          setLocalWallet(restoredWallet);
          setWallet(restoredWallet);
          fetchBalance(restoredWallet.address);
        }
      } catch (error) {
        console.error("Failed to restore wallet from local storage:", error);
      }
    }
    setLoading(false);
  }, [setWallet, encryptionPassword]);

  const fetchBalance = async (address) => {
    try {
      const balanceWei = await provider.getBalance(address);
      setBalance(ethers.formatEther(balanceWei));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const createLocalWallet = async () => {
    if (!encryptionPassword) {
      alert("Please enter a password to encrypt your wallet.");
      return;
    }
    const newWallet = ethers.Wallet.createRandom();
    const encryptedKey = encryptPrivateKey(newWallet.privateKey, encryptionPassword);
    localStorage.setItem("localWallet", encryptedKey);
    setLocalWallet(newWallet);
    setWallet(newWallet);
    await fetchBalance(newWallet.address);
    alert(`New wallet created! Address: ${newWallet.address}`);
  };

  return (
    <div className="wallet-container">
      <h3 className="wallet-header">Your Local Wallet</h3>
      <input
        type="password"
        placeholder="Enter Encryption Password"
        className="wallet-input"
        value={encryptionPassword}
        onChange={(e) => setEncryptionPassword(e.target.value)}
      />
      {loading ? (
        <p>Loading wallet...</p>
      ) : wallet ? (
        <>
          <p className="wallet-info"><strong>Public Address:</strong> {wallet.address}</p>
          <p className="wallet-info"><strong>Balance:</strong> {balance} BNB</p>
        </>
      ) : (
        <>
          <p>No wallet created yet.</p>
          <button onClick={createLocalWallet} className="wallet-button">
            Create Local Wallet
          </button>
        </>
      )}
    </div>
  );
};

export default Wallet;
