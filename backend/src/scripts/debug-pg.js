import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function debug() {
    try {
        const res = await pool.query('SELECT 1 as "validFrom", 2 as "validUntil"');
        console.log('Row object keys:', Object.keys(res.rows[0]));
        console.log('Row object values:', res.rows[0]);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}
debug();
