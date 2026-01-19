import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function listTables() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
    try {
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Tables:", res.rows.map(r => r.table_name).join(', '));

        for (const table of res.rows.map(r => r.table_name)) {
            const cols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${table}'`);
            console.log(`Columns in ${table}:`, cols.rows.map(c => c.column_name).join(', '));
        }

    } catch (err) {
        console.error(err.message);
    } finally {
        await pool.end();
    }
}

listTables();
