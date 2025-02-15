import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WalletComponent from "../components/Wallet";

const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
const contractAddress = "0xA6D5397e8a979225dfdC0d4E1E4Cf167d3f6b659";
const contractABI = [
  {
    "inputs": [{ "internalType": "string", "name": "metadataURI", "type": "string" }],
    "name": "mintNFT",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const BSC_API_KEY = "WXJYBYQFGYWC2D9ST3QIA1IAG4Q4RB57ES"; // BscScan API Key
const BSC_API_URL = "https://api-testnet.bscscan.com/api";

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState("0");
  const [latestTxHash, setLatestTxHash] = useState(null);
  const [metadataURI, setMetadataURI] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  // ✅ Fetch Wallet Balance
  const fetchBalance = async (walletAddress) => {
    try {
      const balanceWei = await provider.getBalance(walletAddress);
      setBalance(ethers.formatEther(balanceWei));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // ✅ Fetch Latest NFT Minting Transaction via BscScan API
  const fetchLatestTransaction = async () => {
    if (!wallet) return alert("Connect your wallet first!");
    setLoadingPredictions(true);

    try {
      const response = await fetch(
        `${BSC_API_URL}?module=account&action=txlist&address=${wallet.address}&sort=desc&apikey=${BSC_API_KEY}`
      );
      const data = await response.json();

      if (data.status !== "1" || !data.result.length) {
        alert("No NFT minting transactions found for your wallet.");
        setLoadingPredictions(false);
        return;
      }

      // ✅ Find the latest transaction related to the contract
      const mintTx = data.result.find(tx => tx.to.toLowerCase() === contractAddress.toLowerCase());

      if (mintTx) {
        setLatestTxHash(mintTx.hash);
        console.log("✅ Latest Transaction Hash:", mintTx.hash);
        await extractMetadataFromLogs(mintTx.hash);
      } else {
        alert("No NFT minting transaction found for your wallet.");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
    setLoadingPredictions(false);
  };

  // ✅ Extract metadataURI manually from logs
  const extractMetadataFromLogs = async (txHash) => {
    try {
      const receipt = await provider.getTransactionReceipt(txHash);
      if (!receipt) {
        alert("Transaction receipt not found.");
        return;
      }

      console.log("✅ Transaction Logs:", receipt.logs);

      for (const log of receipt.logs) {
        if (log.address.toLowerCase() === contractAddress.toLowerCase()) {
          console.log("✅ Found matching log:", log);

          let tokenURIHex = log.data;

          if (tokenURIHex && tokenURIHex.length > 2) {
            // ✅ Decode metadata
            const decodedMetadata = decodeMetadataFromHex(tokenURIHex);

            if (decodedMetadata) {
              setMetadataURI(decodedMetadata);
              setPredictions(decodedMetadata);
            }
          } else {
            console.warn("⚠️ No valid metadataURI found in log.");
          }
        }
      }
    } catch (error) {
      console.error("❌ Error fetching transaction logs:", error);
    }
  };

  // ✅ Function to Extract and Decode MetadataURI
  function decodeMetadataFromHex(hex) {
    try {
      console.log("📌 Raw Hex Data:", hex);

      // ✅ Extract relevant portion (removes padding & metadata headers)
      const startIndex = hex.indexOf("646174613a"); // "data:" in hex
      if (startIndex === -1) {
        console.warn("⚠️ No valid metadata found.");
        return null;
      }

      const metadataHex = hex.substring(startIndex);
      const metadataString = hexToString(metadataHex);

      console.log("✅ Extracted Metadata URI:", metadataString);

      // ✅ Decode Base64 JSON if applicable
      if (metadataString.startsWith("data:application/json;base64,")) {
        try {
          const base64Encoded = metadataString.split(",")[1];
          const jsonMetadata = atob(base64Encoded);
          console.log("✅ Decoded JSON Metadata:", jsonMetadata);
          return JSON.parse(jsonMetadata);
        } catch (base64Error) {
          console.error("❌ Error decoding Base64 JSON:", base64Error);
          return null;
        }
      } else {
        console.warn("⚠️ Metadata URI does not contain Base64 data.");
        return null;
      }
    } catch (error) {
      console.error("❌ Error processing metadata:", error);
      return null;
    }
  }

  // ✅ Function to Convert Hex to Readable String
  function hexToString(hex) {
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
      const byte = parseInt(hex.substr(i, 2), 16);
      if (byte !== 0) str += String.fromCharCode(byte); // Skip null bytes
    }
    return str;
  }

  useEffect(() => {
    if (wallet) {
      fetchBalance(wallet.address);
    }
  }, [wallet]);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">💰 Wallet Management</h2>
      <WalletComponent setWallet={setWallet} />

      {wallet && (
        <div className="wallet-summary mt-4 p-3 border rounded bg-gray-100 text-center">
          <h3 className="text-lg font-semibold">Your Wallet Details</h3>
          <p className="break-all"><strong>Address:</strong> {wallet.address}</p>
          <p className="mt-2"><strong>Balance:</strong> {balance} tBNB</p>
          {latestTxHash && (
            <p className="mt-2">
              <strong>Latest NFT Transaction:</strong>
              <a href={`https://testnet.bscscan.com/tx/${latestTxHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {latestTxHash}
              </a>
            </p>
          )}
          <p className="mt-2 text-green-600"><strong>Connected!</strong> Your wallet is ready for transactions.</p>
        </div>
      )}

      {/* Fetch Predictions Button */}
      <button
        onClick={fetchLatestTransaction}
        className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        disabled={loadingPredictions}
      >
        {loadingPredictions ? "Fetching..." : "Fetch My Predictions"}
      </button>

      {/* Display Predictions */}
      {predictions?.predictions && (
        <div className="mt-4 p-3 border rounded bg-white text-center">
          <h3 className="text-lg font-semibold">Your Round 1 Predictions</h3>
          <ul className="list-disc text-left mx-auto w-4/5">
            {predictions.predictions.map((team, index) => (
              <li key={index} className="mt-1">{team}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
