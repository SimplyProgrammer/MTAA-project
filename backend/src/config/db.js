const { Pool } = require('pg');
const db = new Pool({
	user: process.env.DB_USER || 'postgres',
	host: process.env.DB_HOST || 'localhost',
	database: process.env.DB_NAME || 'mtaa',
	password:  process.env.DB_PASSWD || 'admin',
	port: process.env.DB_PORT || 5432
});

module.exports = db;