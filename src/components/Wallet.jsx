import { useState, useEffect } from "react";
import { ethers } from "ethers";

const Wallet = ({ setWallet }) => {
  const [wallet, setLocalWallet] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  useEffect(() => {
    const savedPrivateKey = localStorage.getItem("localWallet");
    if (savedPrivateKey) {
      const restoredWallet = new ethers.Wallet(savedPrivateKey);
      setLocalWallet(restoredWallet);
      setWallet(restoredWallet);
    }
  }, [setWallet]);

  const createLocalWallet = () => {
    const newWallet = ethers.Wallet.createRandom();
    localStorage.setItem("localWallet", newWallet.privateKey);
    setLocalWallet(newWallet);
    setWallet(newWallet);
    alert(`New wallet created! Address: ${newWallet.address}`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="mt-4 p-3 border rounded bg-gray-100 text-center">
      <h3 className="text-lg font-semibold">Your Local Wallet</h3>
      {wallet ? (
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
        </>
      )}
    </div>
  );
};

export default Wallet;
