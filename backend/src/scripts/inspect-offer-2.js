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

async function inspect() {
    try {
        const res = await pool.query("SELECT * FROM offers WHERE id = 3");
        if (res.rows.length > 0) {
            const row = res.rows[0];
            for (const [key, value] of Object.entries(row)) {
                console.log(`${key}: ${value}`);
            }
        }
    } catch (err) {
        console.error(err.message);
    } finally {
        await pool.end();
    }
}
inspect();
