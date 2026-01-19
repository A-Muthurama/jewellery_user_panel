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

async function cleanAndCheck() {
    try {
        // 1. Delete local test offers
        const delRes = await pool.query("DELETE FROM offers WHERE title = 'Local Test Jewellers' OR shop_name = 'Local Test Jewellers'");
        console.log(`Deleted ${delRes.rowCount} local test offers.`);

        // 2. Check the approved offer
        const res = await pool.query("SELECT id, title, status, valid_until, NOW() as current_time FROM offers WHERE id = 2");
        if (res.rows.length > 0) {
            const row = res.rows[0];
            console.log('\n--- Real Offer Check (ID 2) ---');
            console.log('Title:', row.title);
            console.log('Status:', row.status);
            console.log('Valid Until:', row.valid_until);
            console.log('Current Time:', row.current_time);

            const isValid = !row.valid_until || new Date(row.valid_until) >= new Date(row.current_time);
            console.log('Is Date Valid?:', isValid);
        } else {
            console.log('\n❌ Offer ID 2 not found.');
        }

        // 3. List all approved offers
        const approved = await pool.query("SELECT id, title, status FROM offers WHERE UPPER(status) = 'APPROVED'");
        console.log(`\nFound ${approved.rowCount} APPROVED offers in total.`);
        approved.rows.forEach(r => {
            console.log(`- [${r.id}] ${r.title}`);
        });

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

cleanAndCheck();
