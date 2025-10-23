const userDB = require('./db_users');

// daftar user baru
async function registerUser(telegramId, username) {
  return new Promise((resolve, reject) => {
    userDB.query('SELECT * FROM users WHERE telegram_id = ?', [telegramId], (err, res) => {
      if (err) return reject(err);
      if (res.length > 0) return resolve('✅ Kamu sudah terdaftar.');
      userDB.query(
        'INSERT INTO users (telegram_id, username, role) VALUES (?, ?, ?)',
        [telegramId, username, 'user'],
        (err2) => {
          if (err2) return reject(err2);
          resolve('🎉 Registrasi berhasil! Akun kamu sudah dibuat.');
        }
      );
    });
  });
}

// cek user sudah terdaftar atau belum
async function isUserRegistered(telegramId) {
  return new Promise((resolve, reject) => {
    userDB.query('SELECT * FROM users WHERE telegram_id = ?', [telegramId], (err, res) => {
      if (err) return reject(err);
      resolve(res.length > 0);
    });
  });
}

// ambil role user
async function getUserRole(telegramId) {
  return new Promise((resolve, reject) => {
    userDB.query('SELECT role FROM users WHERE telegram_id = ?', [telegramId], (err, res) => {
      if (err) return reject(err);
      resolve(res[0] ? res[0].role : 'user');
    });
  });
}

module.exports = { registerUser, isUserRegistered, getUserRole };