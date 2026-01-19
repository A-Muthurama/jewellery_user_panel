import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testConnection() {
    console.log("Connecting to:", process.env.DATABASE_URL);
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("Connection SUCCESSFUL!");

        // Check columns in 'offers' table
        const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'offers'");
        console.log("Columns in 'offers' table:", cols.rows.map(c => c.column_name).join(', '));

        const offers = await pool.query("SELECT * FROM offers");
        console.log(`Found ${offers.rowCount} offers.`);
        offers.rows.forEach(o => {
            console.log(`- ID: ${o.id}, Status: ${o.status}, Title: ${o.title || o.product_title || 'N/A'}`);
        });

    } catch (err) {
        console.error("DATABASE ERROR:", err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
