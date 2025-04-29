const { Pool } = require('pg');
const db = new Pool(
	process.env.DATABASE_URL ? {
		connectionString: process.env.DATABASE_URL,
		ssl: { rejectUnauthorized: false },

		connectionTimeoutMillis: 9000
	} : {
		user: process.env.DB_USER || 'postgres',
		host: process.env.DB_HOST || 'localhost',
		database: process.env.DB_NAME || 'mtaa',
		password: process.env.DB_PASSWD || 'admin',
		port: process.env.DB_PORT || 5432,

		connectionTimeoutMillis: 9000
	}
);

db.query('SELECT NOW()').then(res => console.log('Connected to DB at:', res.rows[0].now))
	.catch(err => {
		console.error('Database connection error:', err.stack);
		process.exit(1);
	});

const select = (query, params) => db.query(`SELECT * FROM ${query}`, params);

const insert = (query, params) => db.query(`INSERT INTO ${query} RETURNING *`, params);

const update = (query, params) => db.query(`UPDATE ${query} RETURNING *`, params);

const remove = (query, params) => db.query(`DELETE FROM ${query} RETURNING *`, params);

const query = (query, params) => db.query(query, params);

const begin = () => db.query('BEGIN');
const commit = () => db.query('COMMIT');
const rollback = () => db.query('ROLLBACK');

module.exports = { select, insert, update, remove, query, begin, commit, rollback, db };
