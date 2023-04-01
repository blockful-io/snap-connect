import { Telegraf } from "telegraf";
import { nftVerification } from "./nftVerification";
const { message } = require("telegraf/filters");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply("Welcome to Snap Connect!"));

bot.on(message("text"), nftVerification);

bot.launch();
