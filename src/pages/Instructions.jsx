import React from "react";
import "../styles/instructions_styles.css";

export default function Instructions() {
  return (
    <div className="instructions-container">
      <h2 className="instructions-header">📜 Instructions</h2>
      
      {/* Wallet Instructions */}
      <section className="instructions-section">
        <h3>🔑 Wallet Setup</h3>
        <p>To use the NRL 2025 platform, you need to set up a wallet. Follow these steps:</p>
        <ul>
          <li>Enter a secure password to encrypt your wallet.</li>
          <li>Create a new wallet and record your <strong>public key</strong>.</li>
          <li>The <strong>public key</strong> is your wallet address; it can be shared to receive tokens.</li>
          <li>Your <strong>private key</strong> is used to access your wallet. <strong>Do not share this with anyone.</strong></li>
          <li>Store your private key securely. If lost, you cannot recover your wallet.</li>
        </ul>
      </section>
      
      {/* Wallet Recovery */}
      <section className="instructions-section">
        <h3>🔄 Wallet Recovery</h3>
        <p>If you lose your phone or change browsers:</p>
        <ul>
          <li>Re-enter your private key in the wallet recovery section.</li>
          <li>Ensure you have stored your private key somewhere safe (e.g., password manager).</li>
        </ul>
        <p>To fund your wallet with tokens, send an email to <strong>nrlfootycomp@gmail.com</strong> with your public key.</p>
      </section>
      
      {/* Tipping Competition Instructions */}
      <section className="instructions-section">
        <h3>🏉 NRL Tipping Competition</h3>
        <p>To participate in the tipping competition:</p>
        <ul>
          <li>Select a winner for each match.</li>
          <li>Your selections will appear below for review.</li>
          <li>All matches must have a selection.</li>
          <li>Once selections are complete, click <strong>Mint</strong> to finalize them on the blockchain.</li>
        </ul>
      </section>
    </div>
  );
}
