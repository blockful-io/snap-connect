import express from "express";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { ethers } from "ethers";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 0;
if (PORT === 0) {
  throw new Error("PORT is not defined");
}
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";
if (!INFURA_PROJECT_ID) {
  throw new Error("INFURA_PROJECT_ID is not defined");
}
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
if (!PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is not defined");
}
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";
if (!CONTRACT_ADDRESS) {
  throw new Error("CONTRACT_ADDRESS is not defined");
}
const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID || "";
if (!GROUP_CHAT_ID) {
  throw new Error("GROUP_CHAT_ID is not defined");
}

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
const contracts = {
  mumbai: new ethers.Contract(
    CONTRACT_ADDRESS,
    contractAbi,
    new ethers.providers.JsonRpcProvider(providerUrls.mumbai)
  ),
  celo: new ethers.Contract(
    CONTRACT_ADDRESS,
    contractAbi,
    new ethers.providers.JsonRpcProvider(providerUrls.celo)
  ),
  aurora: new ethers.Contract(
    CONTRACT_ADDRESS,
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
  try {
    // @ts-ignore
    const contract = contracts[network];
    console.log("contract address", contract.address);
    const tx = await contract
      .connect(wallet)
      .mint(address, Number(Math.floor(Math.random() * 100000000)));
    const receipt = await tx.wait();
    console.log(receipt);
    await sendFinalMessage(userId, receipt.transactionHash);
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

async function sendFinalMessage(chatId: number, txHash: string) {
  const inviteLink = await generateInviteLink(Number(GROUP_CHAT_ID));

  bot.sendMessage(
    chatId,
    `Olá! 👋

Parabéns! 🎉 Você acaba de concluir todos os passos necessários para ter o primeiro NFT e agora é um membro confiável do nosso exclusivo Snap Connect Premium Group! 🥳

Ficamos muito felizes em tê-lo como parte da nossa comunidade de colecionadores e entusiastas de NFTs. 👏

Enviamos um link de convite para você no chat. Assim que você ingressar no grupo, terá acesso a uma comunidade de pessoas apaixonadas por NFTs e a oportunidade de adquirir mais colecionáveis exclusivos. 🤑💎

Novamente, parabéns por completar os passos necessários e estamos ansiosos para vê-lo no grupo! 😃

A transação pode ser verificada aqui: https://explorer.celo.org/alfajores/tx/${txHash}
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
