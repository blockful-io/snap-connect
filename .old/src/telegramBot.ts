import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // Echo the user's message
  bot.sendMessage(chatId, "to brincando");
});

export default bot;
