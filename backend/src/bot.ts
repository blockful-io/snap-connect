import TelegramBot from "node-telegram-bot-api";

import dotenv from "dotenv";
import { cleanEnv, num, str } from "envalid";

dotenv.config();

const env = cleanEnv(process.env, {
  TELEGRAM_BOT_TOKEN: str(),
  GROUP_CHAT_ID: num(),
});
const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
const GROUP_CHAT_ID = env.GROUP_CHAT_ID;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// send message as soon as user starts the bot
bot.onText(/\/start/, (msg) => {
  // send initialMessage and a button to go to the website
  const websiteUrl = `https://snapconnect.us/?user=${msg.chat.id}`;

  const initialMessage = `Olá! 😃 Eu sou o Assistente Virtual Snap Connect. 🤖 É um prazer conhecê-lo!
    
Para se juntar ao exclusivo Grupo Premium Snap Connect, solicitamos que você conclua alguns passos iniciais em nosso site. Essas etapas nos ajudarão a garantir que você seja um membro confiável e esteja pronto para adquirir seu primeiro NFT.🔒💰

Assim que adquirir seu NFT, por favor, retorne a esta conversa e teremos o prazer de convidá-lo para o nosso sofisticado e acolhedor Grupo Deluxe.🎉🥳

Estamos ansiosos para tê-lo como parte da nossa comunidade!🤝 Até breve.👋`;

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

export async function sendFinalMessage(chatId: number, txHash: string) {
  const inviteLink = await generateInviteLink(Number(GROUP_CHAT_ID));

  const explorerLink = "https://mumbai.polygonscan.com/tx/" + txHash;

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
