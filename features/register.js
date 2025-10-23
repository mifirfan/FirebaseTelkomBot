import { dbUser, queryDB } from "../utils/db.js";

export async function handleRegister(bot, msg) {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;
  const username = msg.from.username || `user_${telegramId}`;

  try {
    // cek apakah sudah ada user
    const existing = await queryDB(
      dbUser,
      "SELECT * FROM users WHERE telegram_id = ?",
      [telegramId]
    );

    if (existing.length > 0) {
      await bot.sendMessage(chatId, `✅ Kamu sudah terdaftar sebagai *${existing[0].username}*`, { parse_mode: "Markdown" });
      return;
    }

    // simpan user baru
    await queryDB(
      dbUser,
      "INSERT INTO users (telegram_id, username, role) VALUES (?, ?, 'user')",
      [telegramId, username]
    );

    await bot.sendMessage(chatId, `🎉 Pendaftaran berhasil!\nSelamat datang, *${username}*`, { parse_mode: "Markdown" });

  } catch (err) {
    console.error("Register Error:", err);
    await bot.sendMessage(chatId, "❌ Terjadi kesalahan saat registrasi.");
  }
}

export async function checkLogin(bot, msg) {
  const telegramId = msg.from.id;
  const users = await queryDB(dbUser, "SELECT * FROM users WHERE telegram_id = ?", [telegramId]);
  return users.length > 0 ? users[0] : null;
}
