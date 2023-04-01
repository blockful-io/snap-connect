import bot from "./telegramBot";

import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;

app.post("/snap-create", async (req, res) => {
  const { username, phone } = req.body;

  if (!username || !phone) {
    return res.status(400).send("username and phone are required");
  }

  try {
    const user = await bot.getChatMember("@" + username, phone);
    const chatId = user.user.id;

    const web3Intro = `
You were invited by a friend to test Web3! Web3 is a new way to interact with the decentralized internet, powered by blockchain technology.

To get started, you'll need a Web3 wallet. A Web3 wallet allows you to securely store and manage your cryptocurrencies and interact with decentralized applications (dApps).

Here's how to create a Web3 wallet securely:

1. Choose a reputable wallet provider like MetaMask, Trust Wallet, or Coinbase Wallet.
2. Download and install the wallet as a browser extension or mobile app.
3. Follow the wallet provider's instructions to create a new wallet. Be sure to back up your seed phrase securely, as it is the only way to recover your wallet if you lose access.
4. Once your wallet is set up, you can find your account address in the wallet interface. It usually starts with '0x' followed by a series of alphanumeric characters.
`;

    await bot.sendMessage(chatId, web3Intro);

    const giftNftMessage =
      "At which wallet address would you like to receive a gift NFT?";
    await bot.sendMessage(chatId, giftNftMessage);

    res.status(200).send("Messages sent");
  } catch (error: any) {
    res.status(500).send("Error sending messages: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
