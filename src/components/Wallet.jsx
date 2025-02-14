import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";

const Wallet = ({ setWallet }) => {
  const [wallet, setLocalWallet] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [manualPrivateKey, setManualPrivateKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [encryptionPassword, setEncryptionPassword] = useState("");

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
        }
      } catch (error) {
        console.error("Failed to restore wallet from local storage:", error);
      }
    }
    setLoading(false);
  }, [setWallet, encryptionPassword]);

  const createLocalWallet = () => {
    if (!encryptionPassword) {
      alert("Please enter a password to encrypt your wallet.");
      return;
    }
    const newWallet = ethers.Wallet.createRandom();
    const encryptedKey = encryptPrivateKey(newWallet.privateKey, encryptionPassword);
    localStorage.setItem("localWallet", encryptedKey);
    setLocalWallet(newWallet);
    setWallet(newWallet);
    alert(`New wallet created! Address: ${newWallet.address}`);
  };

  const loadPrivateKey = () => {
    if (manualPrivateKey.trim()) {
      if (!window.confirm("Are you sure you want to load this private key? Make sure it's correct.")) {
        return;
      }
      try {
        const restoredWallet = new ethers.Wallet(manualPrivateKey.trim());
        const encryptedKey = encryptPrivateKey(manualPrivateKey.trim(), encryptionPassword);
        localStorage.setItem("localWallet", encryptedKey);
        setLocalWallet(restoredWallet);
        setWallet(restoredWallet);
        alert("Wallet successfully loaded from private key!");
      } catch (error) {
        alert("Invalid private key! Please check and try again.");
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="mt-4 p-3 border rounded bg-gray-100 text-center">
      <h3 className="text-lg font-semibold">Your Local Wallet</h3>
      <input
        type="password"
        placeholder="Enter Encryption Password"
        className="w-full p-2 border rounded mt-2"
        value={encryptionPassword}
        onChange={(e) => setEncryptionPassword(e.target.value)}
      />
      {loading ? (
        <p>Loading wallet...</p>
      ) : wallet ? (
        <>
          <p className="break-all"><strong>Public Address:</strong> {wallet.address}</p>
          <button onClick={() => copyToClipboard(wallet.address)} className="w-full mt-2 connect-wallet">
            Copy Public Key
          </button>
          <div className="mt-4">
            <button onClick={() => setShowPrivateKey(!showPrivateKey)} className="w-full bg-red-500 text-white connect-wallet">
              {showPrivateKey ? "Hide Private Key" : "Show Private Key"}
            </button>
            {showPrivateKey && (
              <>
                <p className="mt-2 break-all"><strong>Private Key:</strong> {wallet.privateKey}</p>
                <button onClick={() => copyToClipboard(wallet.privateKey)} className="w-full mt-2 connect-wallet">
                  Copy Private Key
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <p>No wallet created yet.</p>
          <button onClick={createLocalWallet} className="w-full mt-4 connect-wallet">
            Create Local Wallet
          </button>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter Private Key"
              className="w-full p-2 border rounded mt-2"
              value={manualPrivateKey}
              onChange={(e) => setManualPrivateKey(e.target.value)}
            />
            <button onClick={loadPrivateKey} className="w-full mt-2 connect-wallet">
              Load Private Key
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Wallet;
