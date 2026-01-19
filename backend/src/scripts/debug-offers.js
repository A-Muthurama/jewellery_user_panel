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

async function findOffers() {
    try {
        const res = await pool.query("SELECT id, shop_name, status FROM offers");
        console.log(`Found ${res.rowCount} offers in database.`);
        res.rows.forEach(r => console.log(`- [${r.id}] ${r.shop_name} | Status: ${r.status}`));
    } catch (err) {
        console.error(err.message);
    } finally {
        await pool.end();
    }
}
findOffers();
