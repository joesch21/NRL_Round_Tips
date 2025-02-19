import { ethers } from "ethers";

// ✅ Replace with your actual deployed Relayer Contract Address on BSC Testnet
export const relayerContractAddress = "0x8461Fa67bB99BB8473Cd35428EaB89b9EE298339";

// ✅ Relayer Contract ABI
export const relayerContractABI = [
  {
    "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }],
    "name": "fundWallet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "hasReceivedFunds",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ✅ Function to get the Relayer Contract instance
export const getRelayerContractInstance = async (signer) => {
  return new ethers.Contract(relayerContractAddress, relayerContractABI, signer);
};
