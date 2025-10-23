import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const dbMain = mysql.createPool({
  host: process.env.DB_HOST_MAIN,
  user: process.env.DB_USER_MAIN,
  password: process.env.DB_PASS_MAIN,
  port: process.env.DB_PORT_MAIN,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function queryDB(pool, sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
