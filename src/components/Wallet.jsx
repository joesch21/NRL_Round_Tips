import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { ethers } from "ethers";

const Wallet = ({ setWallet }) => {
  const [wallet, setLocalWallet] = useState(null);

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

  return (
    <div className="mt-4 p-3 border rounded bg-gray-100 text-center">
      <h3 className="text-lg font-semibold">Your Local Wallet</h3>
      {wallet ? <p className="break-all">{wallet.address}</p> : <p>No wallet created yet.</p>}
      {!wallet && (
        <Button onClick={createLocalWallet} className="w-full mt-4 bg-blue-500 text-white">
          Create Local Wallet
        </Button>
      )}
    </div>
  );
};

export default Wallet;
