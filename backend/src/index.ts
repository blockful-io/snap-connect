import { cleanEnv, str, num } from "envalid";
import express from "express";
import TelegramBot from "node-telegram-bot-api";
import { ethers } from "ethers";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: num(),
  TELEGRAM_BOT_TOKEN: str(),
  INFURA_PROJECT_ID: str(),
  PRIVATE_KEY: str(),
  CONTRACT_ADDRESS: str(),
  GROUP_CHAT_ID: num(),
});

const PORT = env.PORT;
const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
const INFURA_PROJECT_ID = env.INFURA_PROJECT_ID;
const PRIVATE_KEY = env.PRIVATE_KEY;
const CONTRACT_ADDRESS = env.CONTRACT_ADDRESS;
const GROUP_CHAT_ID = env.GROUP_CHAT_ID;

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const possibleNetworks = ["mumbai", "celo", "aurora"] as const;

const contractAbi = [
  "function mint(address to, uint256 tokenId) public returns (uint256)",
];
const providerUrls = {
  mumbai: `https://polygon-mumbai.infura.io/v3/${INFURA_PROJECT_ID}`,
  celo: `https://celo-alfajores.infura.io/v3/${INFURA_PROJECT_ID}`,
  aurora: `https://aurora-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
};
const explorerLinks = {
  mumbai: "https://mumbai.polygonscan.com/tx/",
  celo: "https://explorer.celo.org/tx/",
  aurora: "https://explorer.mainnet.aurora.dev/tx/",
};

const contracts = {
  mumbai: new ethers.Contract(
    "0x82ed5CC133b6301f67Dfbc946e1c56F202B1f7A2",
    contractAbi,
    new ethers.providers.JsonRpcProvider(providerUrls.mumbai)
  ),
  celo: new ethers.Contract(
    "0x32F506c37Bd1CbD08bc88675f62502bF3E40b234",
    contractAbi,
    new ethers.providers.JsonRpcProvider(providerUrls.celo)
  ),
  aurora: new ethers.Contract(
    "0x81AaDde5592ee4eE79473dF2AB2eb085E9636A1c",
    contractAbi,
    new ethers.providers.JsonRpcProvider(providerUrls.aurora)
  ),
};
const providers = {
  mumbai: new ethers.providers.JsonRpcProvider(providerUrls.mumbai),
  celo: new ethers.providers.JsonRpcProvider(providerUrls.celo),
  aurora: new ethers.providers.JsonRpcProvider(providerUrls.aurora),
};

app.post("/mint-nft", async (req, res) => {
  const { userId, network, address } = req.body;
  if (!userId) {
    return res.status(400).send({ error: "userId is required" });
  }
  if (network && !possibleNetworks.includes(network)) {
    return res
      .status(400)
      .send({ error: `network must be one of ${possibleNetworks.join(", ")}` });
  }
  if (!address || !ethers.utils.isAddress(address)) {
    return res
      .status(400)
      .send({ error: "address is required and must be valid" });
  }

  // @ts-ignore
  const wallet = new ethers.Wallet(PRIVATE_KEY, providers[network]);
  console.log("wallet address", wallet.address);

  try {
    // @ts-ignore
    const contract = contracts[network];
    console.log("contract address", contract.address);
    const tx = await contract
      .connect(wallet)
      .mint(address, Number(Math.floor(Math.random() * 100000000)));
    const receipt = await tx.wait();
    console.log(receipt);
    await sendFinalMessage(userId, receipt.transactionHash, network);
    res.send({ success: true, receipt });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

// BOT STUFF
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

const initialMessage = `Olá! 😃 Eu sou o Assistente Virtual Snap Connect. 🤖 É um prazer conhecê-lo!

Para se juntar ao exclusivo Grupo Premium Snap Connect, solicitamos que você conclua alguns passos iniciais em nosso site. Essas etapas nos ajudarão a garantir que você seja um membro confiável e esteja pronto para adquirir seu primeiro NFT.🔒💰

Assim que adquirir seu NFT, por favor, retorne a esta conversa e teremos o prazer de convidá-lo para o nosso sofisticado e acolhedor Grupo Deluxe.🎉🥳

Estamos ansiosos para tê-lo como parte da nossa comunidade!🤝 Até breve.👋`;

// send message as soon as user starts the bot
bot.onText(/\/start/, (msg) => {
  // send initialMessage and a button to go to the website
  const websiteUrl = `https://snapconnect.us/?user=${msg.chat.id}`;

  bot.sendMessage(msg.chat.id, initialMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Clique aqui para começar",
            url: websiteUrl,
          },
        ],
      ],
    },
  });
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === "chatId") {
    bot.sendMessage(chatId, `Your chatId is ${chatId}`);
  }
});

async function generateInviteLink(chatId: number): Promise<string> {
  const result = await bot.createChatInviteLink(
    chatId,
    undefined,
    undefined,
    1
  );
  return result.invite_link;
}

const networkExplorers = {
  mumbai: "https://mumbai.polygonscan.com/address/",
  celo: "https://explorer.celo.org/alfajores/tx/",
  aurora: "https://explorer.testnet.aurora.dev/tx/",
};

async function sendFinalMessage(
  chatId: number,
  txHash: string,
  network: string
) {
  const inviteLink = await generateInviteLink(Number(GROUP_CHAT_ID));

  // @ts-ignore
  const explorerLink = networkExplorers[network] + txHash;

  bot.sendMessage(
    chatId,
    `Olá! 👋

Parabéns! 🎉 Você acaba de concluir todos os passos necessários para ter o primeiro NFT e agora é um membro confiável do nosso exclusivo Snap Connect Premium Group! 🥳

Ficamos muito felizes em tê-lo como parte da nossa comunidade de colecionadores e entusiastas de NFTs. 👏

Enviamos um link de convite para você no chat. Assim que você ingressar no grupo, terá acesso a uma comunidade de pessoas apaixonadas por NFTs e a oportunidade de adquirir mais colecionáveis exclusivos. 🤑💎

Novamente, parabéns por completar os passos necessários e estamos ansiosos para vê-lo no grupo! 😃

A transação pode ser verificada aqui: ${explorerLink}
`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Clique aqui para entrar no grupo",
              url: inviteLink,
            },
          ],
        ],
      },
    }
  );
}
