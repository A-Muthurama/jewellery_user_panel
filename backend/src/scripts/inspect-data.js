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
        const res = await pool.query("SELECT * FROM offers WHERE UPPER(status) = 'APPROVED' LIMIT 1");
        if (res.rows.length > 0) {
            console.log('Sample Offer Data:');
            console.log(JSON.stringify(res.rows[0], null, 2));
        } else {
            console.log('No approved offers found.');
            const resAll = await pool.query("SELECT * FROM offers LIMIT 1");
            if (resAll.rows.length > 0) {
                console.log('Sample Offer Data (Any):');
                console.log(JSON.stringify(resAll.rows[0], null, 2));
            }
        }
    } catch (err) {
        console.error(err.message);
    } finally {
        await pool.end();
    }
}
inspect();
