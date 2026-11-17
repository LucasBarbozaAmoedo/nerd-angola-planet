
/* ==========================================
   NERD ANGOLA PLANET
   Conexão com o banco de dados
========================================== */

require('dotenv').config();

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configura a conexão com o banco de dados
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10
};

// Habilita TLS somente quando configurado no ambiente
if (process.env.DB_SSL === 'true') {
  config.ssl = {
    ca: fs.readFileSync(
      path.join(__dirname, 'isrgrootx1.pem'),
      'utf8'
    ),
    rejectUnauthorized: true
  };
}

// Cria o pool de conexões MySQL
const db = mysql.createPool(config);

module.exports = db;
