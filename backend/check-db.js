require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'gearguard',
    });

    console.log('✅ Database connection successful!');
    
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 Tables found:', tables.length);
    tables.forEach(table => {
      console.log('   -', Object.values(table)[0]);
    });
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Solutions:');
      console.error('   1. Make sure MySQL is running');
      console.error('   2. Check your .env file has correct credentials');
      console.error('   3. Verify MySQL is listening on the correct port (default: 3306)');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Solution: Run the schema.sql file to create the database');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Solution: Check your DB_USER and DB_PASSWORD in .env file');
    }
    
    process.exit(1);
  }
}

checkDatabase();

