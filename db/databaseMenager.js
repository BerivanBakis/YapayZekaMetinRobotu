// Berivan Bakış 16.05.2024
const { Pool } = require("pg");
const DBPool = new Pool({
    user: process.env.DB_USER || 'user123',
    host: process.env.DB_HOST || 'localhost', 
    database: process.env.DB_NAME || 'db123',
    password: process.env.DB_PASSWORD || 'password123',
    port: 5432,
});
DBPool.connect()
    .then(() => {
        console.log("Connected to the database successfully!");
    })
    .catch(err => {
        console.error("Error connecting to the database:", err);
    });
module.exports = DBPool;
