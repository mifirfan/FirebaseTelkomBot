import { dbMain, queryDB } from "../utils/db.js";

/**
 * Tampilkan daftar aktivitas DIP (ringkas)
 */
export async function showDIP(bot, chatId, user) {
  try {
    const role = user.role || "user";
    let sql = "";
    let params = [];

    if (role === "admin") {
      sql = `
        SELECT id, kode_sf, tanggal, aktivitas, lokasi, status
        FROM dip_activity
        ORDER BY tanggal DESC
        LIMIT 10
      `;
    } else {
      sql = `
        SELECT id, tanggal, aktivitas, lokasi, status
        FROM dip_activity
        WHERE kode_sf = ?
        ORDER BY tanggal DESC
        LIMIT 10
      `;
      params = [user.username];
    }

    const data = await queryDB(dbMain, sql, params);
    if (data.length === 0)
      return bot.sendMessage(chatId, "📭 Belum ada aktivitas DIP ditemukan.");

    let text = `📋 *Aktivitas DIP (${user.username})*\n`;
    text += "-------------------------\n";

    const buttons = data.map((d) => [
      { text: `🔍 ${d.aktivitas} (${d.status})`, callback_data: `dip_detail:${d.id}` },
    ]);

    await bot.sendMessage(chatId, text, {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: buttons },
    });
  } catch (err) {
    console.error("DIP Error:", err);
    await bot.sendMessage(chatId, "❌ Gagal mengambil data DIP.");
  }
}

/**
 * Detail aktivitas per ID
 */
export async function showDIPDetail(bot, chatId, id) {
  try {
    const sql = `
      SELECT id, kode_sf, tanggal, aktivitas, lokasi, notes, status
      FROM dip_activity
      WHERE id = ?
    `;
    const [data] = await queryDB(dbMain, sql, [id]);

    if (!data)
      return bot.sendMessage(chatId, "📭 Aktivitas tidak ditemukan.");

    const text = `
📝 *Detail Aktivitas DIP*
━━━━━━━━━━━━━━━
📅 *Tanggal:* ${data.tanggal}
👤 *Kode SF:* ${data.kode_sf}
🏷 *Aktivitas:* ${data.aktivitas}
📍 *Lokasi:* ${data.lokasi}
🗒 *Catatan:* ${data.notes || "-"}
⚙️ *Status:* ${data.status}
`;

    const buttons = [
      [
        { text: "🟢 Selesai", callback_data: `update_status:${id}:Done` },
        { text: "🟡 On Progress", callback_data: `update_status:${id}:On Progress` },
      ],
      [
        { text: "🔙 Kembali", callback_data: "dip_back" },
      ],
    ];

    await bot.sendMessage(chatId, text, {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: buttons },
    });
  } catch (err) {
    console.error("DIP Detail Error:", err);
    await bot.sendMessage(chatId, "❌ Gagal menampilkan detail aktivitas.");
  }
}

/**
 * Update status aktivitas
 */
export async function updateDIPStatus(bot, chatId, id, status) {
  try {
    const sql = `
      UPDATE dip_activity
      SET status = ?
      WHERE id = ?
    `;
    await queryDB(dbMain, sql, [status, id]);

    await bot.sendMessage(
      chatId,
      `✅ Status aktivitas *${id}* berhasil diubah menjadi *${status}*!`,
      { parse_mode: "Markdown" }
    );

    // tampilkan ulang detail aktivitas
    await showDIPDetail(bot, chatId, id);
  } catch (err) {
    console.error("DIP Update Error:", err);
    await bot.sendMessage(chatId, "❌ Gagal memperbarui status aktivitas.");
  }
}
