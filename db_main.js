const mysql = require('mysql2');

const mainDB = mysql.createConnection({
  host: process.env.DB_HOST_MAIN,
  user: process.env.DB_USER_MAIN,
  password: process.env.DB_PASS_MAIN,
  multipleStatements: true
});

mainDB.connect((err) => {
  if (err) throw err;
  console.log(`✅ MySQL Connected ke host ${process.env.DB_HOST_MAIN}`);
});

module.exports = mainDB;