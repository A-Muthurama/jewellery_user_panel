
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function fixOffers() {
    try {
        console.log("Updating expired offers...");
        // Update offers 1 and 2 to expire end of Feb 2026
        const result = await pool.query(`
            UPDATE offers 
            SET end_date = '2026-02-28' 
            WHERE id IN (1, 2)
            RETURNING id, end_date
        `);
        console.log("Updated offers:", result.rows);
    } catch (err) {
        console.error("Error updating offers:", err.message);
    } finally {
        await pool.end();
    }
}

fixOffers();
