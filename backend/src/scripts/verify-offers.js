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

async function checkOffers() {
    try {
        console.log('Testing connection to:', process.env.DATABASE_URL.split('@')[1].split('/')[0]);

        // Try to describe the table
        const res = await pool.query(`SELECT * FROM offers LIMIT 0`);
        console.log('✅ Success! The "offers" table exists.');

        // Check columns specifically
        const columnsRes = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'offers'
    `);
        console.log('Columns:', columnsRes.rows.map(r => r.column_name).join(', '));

    } catch (err) {
        if (err.code === '42P01') {
            console.log('❌ The "offers" table does not exist yet.');
        } else {
            console.error('Error connecting/querying:', err.message);
        }
    } finally {
        await pool.end();
    }
}

checkOffers();
