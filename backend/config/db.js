const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'SecurePass123!',
  database: 'LavadoVaporBogotaDB',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(conn => {
    console.log('Conectado a la base de datos MySQL - LavadoVaporBogotaDB');
    conn.release();
  })
  .catch(err => {
    console.error('Error conectando a la base de datos:', err);
  });

module.exports = pool;
