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

async function checkDB() {
    try {
        console.log('--- Database Check ---');
        console.log('Neon Host:', process.env.DATABASE_URL.split('@')[1].split('/')[0]);

        // Check if table exists
        const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'offers'
    `);

        if (tableCheck.rows.length === 0) {
            console.log('❌ TABLE "offers" NOT FOUND!');
            return;
        }
        console.log('✅ Found "offers" table.');

        // Check columns
        const columnsCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'offers'
    `);

        console.log('\n--- Columns in "offers" ---');
        columnsCheck.rows.forEach(col => {
            console.log(`- ${col.column_name} (${col.data_type})`);
        });

        // Check for "status" column specifically
        const hasStatus = columnsCheck.rows.some(col => col.column_name === 'status');
        console.log(`\nHas "status" column: ${hasStatus ? 'YES' : 'NO'}`);

        // Check counts
        const statusCounts = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM offers 
      GROUP BY status
    `);

        console.log('\n--- Status Counts ---');
        if (statusCounts.rows.length === 0) {
            console.log('Table is empty.');
        } else {
            statusCounts.rows.forEach(row => {
                console.log(`${row.status || 'NULL'}: ${row.count}`);
            });
        }

    } catch (err) {
        console.error('Database Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkDB();
