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

async function approveAll() {
    try {
        console.log('--- Force Approving All Offers ---');

        // Check if table exists first
        const checkTable = await pool.query("SELECT to_regclass('public.offers') as exists");
        if (!checkTable.rows[0].exists) {
            console.log("❌ Table 'offers' does not exist. Please run setup-db.js first.");
            return;
        }

        const res = await pool.query(`
      UPDATE offers 
      SET status = 'approved' 
      WHERE status != 'approved' OR status IS NULL
      RETURNING id, shop_name, status
    `);

        if (res.rowCount === 0) {
            console.log('No offers needed approval (they might all be approved already or table is empty).');
        } else {
            console.log(`✅ Successfully approved ${res.rowCount} offers:`);
            res.rows.forEach(row => {
                console.log(`- ID: ${row.id} | Shop: ${row.shop_name} | Status: ${row.status}`);
            });
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

approveAll();
