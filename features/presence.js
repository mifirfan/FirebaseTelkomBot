import { dbMain, queryDB } from "../utils/db.js";

export async function showPresence(bot, chatId, user) {
  try {
    // ambil data contoh
    const sql = `
      SELECT 
        nama_sf, tanggal, lokasi, status
      FROM field_presence
      WHERE kode_sf = ? 
      ORDER BY tanggal DESC
      LIMIT 10
    `;
    const data = await queryDB(dbMain, sql, [user.username]);

    if (data.length === 0) {
      return bot.sendMessage(chatId, "📭 Belum ada data presensi terbaru.");
    }

    let text = `📅 *Laporan Presensi Terbaru (${user.username})*\n\n`;
    data.forEach((r, i) => {
      text += `${i + 1}. ${r.tanggal} — ${r.lokasi} — ${r.status}\n`;
    });

    await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });

  } catch (err) {
    console.error("Presence Error:", err);
    await bot.sendMessage(chatId, "❌ Gagal mengambil data presensi.");
  }
}
