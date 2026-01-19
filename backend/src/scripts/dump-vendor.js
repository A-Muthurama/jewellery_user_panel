import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function dumpVendor() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
    try {
        const res = await pool.query("SELECT * FROM vendors LIMIT 1");
        console.log("FULL ROW DUMP FROM 'vendors':");
        console.log(JSON.stringify(res.rows[0], null, 2));
    } catch (err) {
        console.error(err.message);
    } finally {
        await pool.end();
    }
}

dumpVendor();
