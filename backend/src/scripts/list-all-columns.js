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

async function findVendorTable() {
    try {
        const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'offers'
    `);
        console.log('--- Columns in "offers" table ---');
        columns.rows.forEach(c => console.log(`- ${c.column_name} (${c.data_type})`));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

findVendorTable();
