import React, { useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const messageToSign =
    "I have the Snap Connect NFT and I am interested in joining the Snap Connect community!";

  const [signature, setSignature] = useState("");
  const [provider, setProvider] = useState<ethers.BrowserProvider>();
  const [address, setAddress] = useState("");

  

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setProvider(provider);
      setAddress(address);
    } else {
      alert("Please install MetaMask or another Ethereum wallet.");
    }
  };

  const signMessage = async () => {
    if (provider) {
      const signer = await provider.getSigner();
      const signedMessage = await signer.signMessage(messageToSign);
      setSignature(signedMessage);
    } else {
      alert("Please connect your wallet first.");
    }
  };

  return (
    <div className="container mx-auto px-4 pb-10">
      <h1 className="text-3xl font-semibold my-8">Verify Your NFT Ownership</h1>
      <h2 className="text-2xl mb-4">Snap Connect NFT Verification</h2>
      <p className="mb-4">
        To join the Snap Connect Telegram community, you need to sign a message
        with your wallet, and then the Snap Connect Telegram bot will verify if
        you have the necessary Snap Connect NFT.
      </p>

      {!address && (
        <p className="mb-4 underline">
          Please connect your wallet to sign the message.
        </p>
      )}
      <button
        onClick={connectWallet}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Connect Wallet
      </button>
      {address && (
        <>
          <p>You are connected with the following Ethereum address:</p>
          <pre className="bg-gray-200 p-4 rounded-md overflow-x-auto">
            {address}
          </pre>
          <p className="mt-4">
            Please sign the following message with your wallet:
          </p>
          <pre className="bg-gray-200 p-4 rounded-md overflow-x-auto">
            {messageToSign}
          </pre>
          <p className="mt-4">
            Once you have signed the message, click the button below to send the
            signature to the Snap Connect Telegram bot.
          </p>
          <button
            onClick={signMessage}
            className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Sign Message
          </button>
        </>
      )}
      {signature && (
        <>
          <p className="mt-4">Your signature is:</p>
          <pre className="bg-gray-200 p-4 rounded-md overflow-x-auto">
            {signature}
          </pre>
          <p className="mt-4">
            Send this signature to the Snap Connect Telegram bot to verify your
            NFT ownership.
          </p>
        </>
      )}
    </div>
  );
}

export default App;
