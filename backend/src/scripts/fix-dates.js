import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function fixOfferDate() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
    try {
        const res = await pool.query("UPDATE offers SET end_date = '2026-12-31' WHERE status = 'APPROVED'");
        console.log(`Updated ${res.rowCount} offers to be valid until 2026-12-31.`);
    } catch (err) {
        console.error("Error updating offer:", err.message);
    } finally {
        await pool.end();
    }
}

fixOfferDate();
