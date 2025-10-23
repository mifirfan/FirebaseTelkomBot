import { dbMain, queryDB } from "../utils/db.js";

export async function showPerformance(bot, chatId, user) {
  try {
    const sql = `
      SELECT 
        DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal,
        produk,
        total_penjualan,
        capaian
      FROM performance_summary
      WHERE kode_sf = ?
      ORDER BY tanggal DESC
      LIMIT 10
    `;
    const data = await queryDB(dbMain, sql, [user.username]);

    if (data.length === 0) {
      return bot.sendMessage(chatId, "📊 Tidak ada data performa ditemukan.");
    }

    let text = `📈 *Laporan Performa (${user.username})*\n\n`;
    text += "Tanggal | Produk | Penjualan | Capaian\n";
    text += "---------------------------------------\n";
    data.forEach((r) => {
      text += `${r.tanggal} | ${r.produk} | ${r.total_penjualan} | ${r.capaian}%\n`;
    });

    await bot.sendMessage(chatId, `\`\`\`\n${text}\n\`\`\``, { parse_mode: "Markdown" });

  } catch (err) {
    console.error("Performance Error:", err);
    await bot.sendMessage(chatId, "❌ Gagal mengambil data performa.");
  }
}