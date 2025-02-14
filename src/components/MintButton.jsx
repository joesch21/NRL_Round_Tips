import { Button } from "../ui/Button";

export default function MintButton({ submitted, walletConnected, mintNFT, minting }) {
  return (
    submitted && walletConnected && (
      <Button onClick={mintNFT} className="w-full mt-4" disabled={minting}>
        {minting ? "Minting..." : "Mint NFT"}
      </Button>
    )
  );
}
