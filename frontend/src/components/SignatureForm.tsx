import React, { useState } from "react";

const SignatureForm: React.FC = () => {
  const [signedMessage, setSignedMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement the logic to send the signed message to the Telegram bot
    console.log("Signed message:", signedMessage);
  };

  return (
    <div className="container mx-auto my-4">
      <h2>Verify Your NFT Ownership</h2>
      <p>
        To verify your ownership of the Snap Connect NFT, please sign a message
        using your Ethereum account and send the resulting hash to the Snap
        Connect Bot on Telegram.
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="signedMessage" className="block mb-2">
            Signed Message:
          </label>
          <input
            type="text"
            id="signedMessage"
            value={signedMessage}
            onChange={(e) => setSignedMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Send to Telegram Bot
        </button>
      </form>
    </div>
  );
};

export default SignatureForm;
