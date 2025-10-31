const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require("path")

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log("Conectando ao banco com as variáveis:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD === '' ? '(vazio)' : '(oculto)'
});


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'sistema_emergencia_unifio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
