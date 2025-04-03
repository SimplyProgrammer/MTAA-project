const dotenv = require("dotenv");
const fs = require("fs");
if (fs.existsSync(".env.local")) {
	dotenv.config({ path: ".env.local", override: true });
}
dotenv.config();

const express = require('express');

const app = express();

app.use(express.json());

// PostgreSQL Pool
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'mtaa',
    password:  process.env.DB_PASSWD || 'mypostgres',
    port: process.env.DB_PORT || 5432
});

console.log(process.env.DB_PASSWD)

app.get("/", (req, res) => {
    res.send("Hello, Node.js Backend!");
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
