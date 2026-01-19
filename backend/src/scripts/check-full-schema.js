import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function checkFullSchema() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
    try {
        const res = await pool.query(`
            SELECT column_name
            FROM information_schema.columns 
            WHERE table_name = 'offers'
        `);
        console.log("OFFERS COLUMNS:", res.rows.map(r => r.column_name).join(', '));

        const res2 = await pool.query(`
            SELECT column_name
            FROM information_schema.columns 
            WHERE table_name = 'vendors'
        `);
        console.log("VENDORS COLUMNS:", res2.rows.map(r => r.column_name).join(', '));

    } catch (err) {
        console.error(err.message);
    } finally {
        await pool.end();
    }
}

checkFullSchema();
