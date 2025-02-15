import { useState, useEffect } from "react";
import { ethers } from "ethers";
import matches from "./data/matches";
import MatchPrediction from "./components/MatchPrediction.jsx";
import SelectedPredictions from "./components/SelectedPredictions.jsx";
import Wallet from "./components/Wallet.jsx";
import { contractAddress, contractABI } from "./utils/contract";

export default function Round1Tips() {
  const [predictions, setPredictions] = useState(() => {
    const savedPredictions = localStorage.getItem("round1Predictions");
    return savedPredictions ? JSON.parse(savedPredictions) : Array(matches.length).fill(null);
  });

  const [wallet, setWallet] = useState(null);
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("round1Predictions", JSON.stringify(predictions));
  }, [predictions]);

  useEffect(() => {
    const savedPrivateKey = localStorage.getItem("localWallet");
    if (savedPrivateKey) {
      try {
        const restoredWallet = new ethers.Wallet(savedPrivateKey);
        setWallet(restoredWallet);
      } catch (error) {
        console.error("Failed to restore wallet from local storage:", error);
      }
    }
  }, []);

  const handlePredictionChange = (index, selectedTeam) => {
    setPredictions((prevPredictions) => {
      const newPredictions = [...prevPredictions];
      newPredictions[index] = selectedTeam;
      localStorage.setItem("round1Predictions", JSON.stringify(newPredictions));
      return newPredictions;
    });
  };

  const mintNFT = async () => {
    if (!wallet) {
      setError("You must create a local wallet before minting.");
      return;
    }
    setMinting(true);
    try {
      const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
      const signer = new ethers.Wallet(wallet.privateKey, provider);
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const metadataURI = `data:application/json;base64,${btoa(JSON.stringify({ predictions }))}`;
      const tx = await contract.mintNFT(metadataURI, { value: ethers.parseEther("0.01") });
      await tx.wait();

      alert("✅ NFT Minted Successfully on Binance Testnet!");
    } catch (error) {
      console.error("Minting failed:", error);
      setError("Minting failed! See console for details.");
    }
    setMinting(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">🔥 Round 1 Games 🔥</h2>
      <MatchPrediction matches={matches} predictions={predictions} handlePredictionChange={handlePredictionChange} />
      <SelectedPredictions predictions={predictions} matches={matches} />
      <Wallet setWallet={setWallet} />
      <button onClick={mintNFT} disabled={!wallet || minting} className="w-full mt-4 mint-button">
        {minting ? "Minting..." : "Let's Mint Your Selection!"}
      </button>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  );
}
