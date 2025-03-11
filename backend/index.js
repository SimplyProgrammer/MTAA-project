const express = require('express');
const { Pool } = require('pg');

const app = express();

app.use(express.json());

const PORT = 8082;

// PostgreSQL Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mtaa',
    password: 'admin',
    port: 5432
});

const retryDelay = 1000; // Delay in ms between retries
const maxRetries = 10; // Maximum number of retries


async function createTables() {

    await createTable(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );
    `, 'users');


}





async function createTable(query, tableName) {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            await pool.query(query);
            console.log(`${tableName} table created or already exists.`);
            return;
        } catch (error) {
            if (error.code === 'ECONNREFUSED' && attempt < maxRetries - 1) {
                console.log(`Database not ready, retrying... Attempt ${attempt + 1}`);
                attempt++;
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
                console.error(`Error creating ${tableName} table:`, error.message);
                break;
            }
        }
    }
}


(async () => {
    try {
        await createTables();
        console.log("All tables created successfully!");
        tablesCreated = true;
    } catch (error) {
        console.error("Error creating tables:", error.message);
    }
})();


app.get("/", (req, res) => {
    res.send("Hello, Node.js Backend!");
});

app.post('/api/login', async (req, res) => {

    const { name } = req.body;

    const result = await pool.query(
        'INSERT INTO users (name) VALUES ($1) RETURNING *',
        [name]
    );

    const user = result.rows[0];
    res.status(201).json({ message: 'User registered successfully', user });


});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
