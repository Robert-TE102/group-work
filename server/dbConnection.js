import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const db = new pg.Pool({
    connectionString: process.env.DB_CONN,
});

db.query(
`CREATE TABLE IF NOT EXISTS userData(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    totalco2 NUMERIC,
    username VARCHAR(255)
)`);
