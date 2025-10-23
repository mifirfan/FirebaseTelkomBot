const mysql = require('mysql2');

const userDB = mysql.createConnection({
  host: process.env.DB_HOST_USER,
  user: process.env.DB_USER_USER,
  password: process.env.DB_PASS_USER,
  database: process.env.DB_NAME_USER
});

userDB.connect((err) => {
  if (err) throw err;
  console.log('✅ User database connected');
});

module.exports = userDB;