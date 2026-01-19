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
        console.log('--- Database Schema Inspection ---');

        const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log('Tables in this DB:', tables.rows.map(r => r.table_name).join(', '));

        if (tables.rows.some(r => r.table_name === 'offers')) {
            const columns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'offers'
        `);
            console.log('\n--- Columns in "offers" table ---');
            columns.rows.forEach(c => console.log(`- ${c.column_name} (${c.data_type})`));

            const sample = await pool.query("SELECT * FROM offers LIMIT 1");
            console.log('\n--- Sample Data ---');
            console.log(JSON.stringify(sample.rows[0], null, 2));
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

findVendorTable();
