import express from "express";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const PORT = process.env.PORT || 0;
if (PORT === 0) {
  throw new Error("PORT is not defined");
}
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
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
});
