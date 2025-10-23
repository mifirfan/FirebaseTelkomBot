import { dbUser, queryDB } from "../utils/db.js";
import { createSession, isSessionExpired, refreshSession } from "../utils/session.js";

export async function handleLogin(bot, msg, userStates) {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;

  const users = await queryDB(dbUser, "SELECT * FROM users WHERE telegram_id = ?", [telegramId]);
  if (users.length === 0) {
    userStates[chatId] = "awaiting_username";
    return bot.sendMessage(chatId, "🔐 Kamu belum terdaftar. Silakan kirim username untuk registrasi.");
  }

  if (isSessionExpired(telegramId)) {
    userStates[chatId] = "awaiting_username";
    return bot.sendMessage(chatId, "⚠️ Sesi kamu sudah habis. Kirim ulang username untuk login kembali.");
  }

  refreshSession(telegramId);
  bot.sendMessage(chatId, `👋 Selamat datang kembali, *${users[0].username}*!`, { parse_mode: "Markdown" });
  bot.sendMessage(chatId, "Ketik /menu untuk melihat fitur yang tersedia.");
}