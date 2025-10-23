import dotenv from "dotenv";
dotenv.config();

import TelegramBot from "node-telegram-bot-api";
import { showDIP, showDIPDetail, updateDIPStatus } from "./features/dip.js";

// Inisialisasi Bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Fungsi dummy login (sementara)
async function checkLogin(bot, message) {
  return {
    telegram_id: message.chat.id,
    username: message.chat.username || "user123",
    role: "admin", // sementara admin untuk akses semua data
  };
}

// Listener utama untuk tombol-tombol callback
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const user = await checkLogin(bot, query.message);
  const data = query.data;

  if (!user) return bot.sendMessage(chatId, "⚠️ Silakan daftar dulu dengan /start");

  try {
    if (data === "dip") return await showDIP(bot, chatId, user);
    if (data.startsWith("dip_detail:")) {
      const id = data.split(":")[1];
      return await showDIPDetail(bot, chatId, id);
    }
    if (data.startsWith("update_status:")) {
      const [, id, status] = data.split(":");
      return await updateDIPStatus(bot, chatId, id, status);
    }
    if (data === "dip_back") return await showDIP(bot, chatId, user);
  } catch (err) {
    console.error("Callback Error:", err);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan internal.");
  }
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "👋 Selamat datang! Pilih menu:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📋 Lihat Aktivitas DIP", callback_data: "dip" }],
      ],
    },
  });
});

console.log("✅ Bot DIP sudah berjalan...");
