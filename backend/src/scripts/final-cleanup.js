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

async function run() {
    try {
        const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'offers'
    `);
        const columns = res.rows.map(r => r.column_name);
        console.log('Columns:', columns);

        // Try to delete local test if columns exist
        if (columns.includes('title')) {
            const del = await pool.query("DELETE FROM offers WHERE title = 'Local Test Jewellers'");
            console.log('Deleted by title:', del.rowCount);
        }
        if (columns.includes('shop_name')) {
            const del = await pool.query("DELETE FROM offers WHERE shop_name = 'Local Test Jewellers'");
            console.log('Deleted by shop_name:', del.rowCount);
        }

    } catch (err) {
        console.error(err.message);
    } finally {
        await pool.end();
    }
}
run();
