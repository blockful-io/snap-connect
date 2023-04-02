import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const messageToSign =
    "I have the Snap Connect NFT and I am interested in joining the Snap Connect community!";

  const [hasWallet, setHasWallet] = useState(false);
  const [snapInstalled, setSnapInstalled] = useState(false);
  const [addressConnected, setAddressConnected] = useState("");
  const [provider, setProvider] = useState<ethers.BrowserProvider>();
  const [signature, setSignature] = useState("");

  useEffect(() => {
    // Check if the user has Metamask installed
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      setHasWallet(true);
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setProvider(provider);
      setAddressConnected(address);
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
      <h1 className="text-3xl font-semibold my-8">Snap Connect Community</h1>
      <h2 className="text-2xl mb-4">
        Learn how to join the Snap Connect Community
      </h2>

      {!hasWallet && (
        <>
          <p className="text-sm text-gray-500 mb-4">step 1/33</p>
          <p className="underline mb-2">
            We have detected that you do not have a wallet installed. Please
            install Metamask to continue.
          </p>
          <ol>
            <li>Open the Google Chrome browser on your computer.</li>
            <li>
              Go to the Chrome Web Store by typing "chrome://extensions" in the
              address bar and hitting enter.
            </li>
            <li>In the Chrome Web Store search bar, type "Metamask".</li>
            <li>
              Click on the "Add to Chrome" button for the Metamask extension.
            </li>
            <li>
              A pop-up window will appear, click on the "Add Extension" button
              to confirm the installation.
            </li>
            <li>
              Once the installation is complete, you should see the Metamask
              icon in the top-right corner of your browser window.
            </li>
            <li>Click on the Metamask icon to open the extension.</li>
            <li>Click on the "Get Started" button.</li>
            <li>
              You will be asked to agree to the terms of use. Read the terms and
              if you agree, click on the "Accept" button.
            </li>
            <li>
              You will then be asked to create a new wallet or import an
              existing one. Choose the option that applies to you and follow the
              instructions.
            </li>
            <li>
              After setting up your wallet, you should be able to use Metamask
              to interact with Ethereum-enabled websites and applications.
            </li>
          </ol>
        </>
      )}

      {hasWallet && !snapInstalled && (
        <>
          <p className="text-sm text-gray-500 mb-4">step 2/33</p>
          <p className="underline mb-2">
            Please install the Snap Connect Metamask snap to continue.
          </p>
          <button
            onClick={() => setSnapInstalled(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Install Snap
          </button>
        </>
      )}

      {hasWallet && snapInstalled && !addressConnected && (
        <>
          <p className="text-sm text-gray-500 mb-4">step 3/33</p>
          <p className="underline mb-2">
            Now you need to connect your Metamask wallet in order to sign the
            transaction.
          </p>
          <button
            onClick={connectWallet}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Connect Wallet
          </button>
        </>
      )}

      {hasWallet && snapInstalled && addressConnected && !signature && (
        <>
          <p className="text-sm text-gray-500 mb-4">step 4/33</p>
          <p className="underline mb-2">
            Now you need to prove that you have a wallet that contains the Snap
            Connect NFT.
          </p>
          <p className="mb-4">
            Please sign the following message with your wallet:
          </p>
          <pre className="bg-gray-200 p-4 rounded-md overflow-x-auto">
            {messageToSign}
          </pre>
          <button
            onClick={signMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 mt-4"
          >
            Sign Message
          </button>
        </>
      )}

      {/* {!address && (
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
      )} */}
    </div>
  );
}

export default App;
