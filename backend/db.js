const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gearguard',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

// Test connection on startup
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error code:', error.code);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure MySQL is running and check your .env file');
    }
  });

module.exports = pool;

