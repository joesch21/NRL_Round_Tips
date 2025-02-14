import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import { Label } from "./components/ui/Label";
import { ethers } from "ethers";
import matches from "./data/matches";

// ✅ Team Logos Mapping
const teamLogos = {
  "Canberra Raiders": "raiders.png",
  "New Zealand Warriors": "warriors.png",
  "Penrith Panthers": "panthers.png",
  "Cronulla-Sutherland Sharks": "sharks.png",
  "Sydney Roosters": "roosters.png",
  "Brisbane Broncos": "broncos.png",
  "Wests Tigers": "tigers.png",
  "Newcastle Knights": "knights.png",
  "Dolphins": "dolphins.png",
  "South Sydney Rabbitohs": "rabbitohs.png",
  "St. George Illawarra Dragons": "dragons.png",
  "Canterbury-Bankstown Bulldogs": "bulldogs.png",
  "Manly-Warringah Sea Eagles": "eagles.png",
  "North Queensland Cowboys": "cowboys.png",
  "Parramatta Eels": "eels.png",
  "Melbourne Storm": "storm.png",
};

// 🔗 Smart Contract Details
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

export default function Round1Tips() {
  // 🎯 State Management
  const [predictions, setPredictions] = useState(() => {
    const savedPredictions = localStorage.getItem("round1Predictions");
    return savedPredictions ? JSON.parse(savedPredictions) : Array(matches.length).fill(null);
  });

  useEffect(() => {
    localStorage.setItem("round1Predictions", JSON.stringify(predictions));
  }, [predictions]);

  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState("");

  // 🔗 Connect Wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setWalletConnected(true);
      } catch (error) {
        console.error("Wallet connection failed", error);
        alert("Wallet connection failed.");
      }
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  };

  // 🏉 Handle Match Selection
  const handlePredictionChange = (index, selectedTeam) => {
    setPredictions((prevPredictions) => {
      const newPredictions = [...prevPredictions];
      newPredictions[index] = selectedTeam;
      localStorage.setItem("round1Predictions", JSON.stringify(newPredictions));
      return newPredictions;
    });
  };

  const allSelectionsMade = predictions.every(prediction => prediction !== null);
  const selectedPredictions = predictions.filter((team) => team !== null);

  // 🏆 Mint NFT Function
  const mintNFT = async () => {
    if (!allSelectionsMade) {
      setError("You must select a winner for each match before minting.");
      return;
    }
    setError("");
    setMinting(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const metadataURI = JSON.stringify({
        name: "Round 1 Tips",
        description: "User's predictions for Round 1 of NRL.",
        predictions: predictions
      });

      const tx = await contract.mintNFT(metadataURI, { value: ethers.parseEther("0.01") });
      await tx.wait();

      alert("NFT Minted Successfully!");
      localStorage.removeItem("round1Predictions");
    } catch (error) {
      console.error(error);
      alert("Minting failed!");
    }
    setMinting(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      {/* 🎯 Main Event Section */}
      <div className="main-event">
        <h2 className="text-2xl font-bold text-center mb-4">🔥 Round 1 Tips - Main Event 🔥</h2>

        {matches.map((match, index) => {
          const [teamA, teamB] = match.split(" vs. ");
          return (
            <Card key={index} className="mb-2">
              <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center">
                <Label className="text-lg font-semibold">{match}</Label>
                <div className="match-buttons">
                  <button
                    className={`px-3 py-1 border rounded font-bold transition ${
                      predictions[index] === teamA ? "selected" : ""
                    }`}
                    onClick={() => handlePredictionChange(index, teamA)}
                  >
                    {teamLogos[teamA] && (
                      <img src={`/logos/${teamLogos[teamA]}`} alt={teamA} className="team-logo" />
                    )}
                    {teamA}
                  </button>
                  <button
                    className={`px-3 py-1 border rounded font-bold transition ${
                      predictions[index] === teamB ? "selected" : ""
                    }`}
                    onClick={() => handlePredictionChange(index, teamB)}
                  >
                    {teamLogos[teamB] && (
                      <img src={`/logos/${teamLogos[teamB]}`} alt={teamB} className="team-logo" />
                    )}
                    {teamB}
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 🚀 Selected Predictions Frame */}
      {selectedPredictions.length > 0 && (
        <div className="selections">
          <h3 className="text-xl font-semibold text-center mb-2">📢 Your Final Predictions</h3>
          <p className="text-sm italic text-center">"The moment of truth! Here are your winning picks."</p>

          {predictions.map((team, index) => (
            team && (
              <div key={index} className="selected-prediction-box">
                {teamLogos[team] && (
                  <img src={`/logos/${teamLogos[team]}`} alt={team} className="team-logo" />
                )}
                <p>{matches[index]}: <span className="font-bold">{team}</span></p>
              </div>
            )
          ))}
        </div>
      )}

      {/* 🔗 Wallet & Mint Buttons */}
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}

      {!walletConnected ? (
        <Button onClick={connectWallet} className="connect-wallet w-full mt-4">
        Connect Wallet
      </Button>
      
      ) : (
        <>
          <p className="text-green-500 text-center mt-2">🔗 Connected: {account}</p>
          <Button
            onClick={mintNFT}
            className="mint-button"
            disabled={!allSelectionsMade || minting}
          >
            {minting ? "Minting..." : "Mint NFT"}
          </Button>
        </>
      )}
    </div>
  );
}
