import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
    try {
        const host = process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1] : 'Unknown';
        console.log('Connecting to:', host);

        // List all tables
        const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);

        console.log('Tables found:', tablesRes.rows.map(r => r.table_name));

        if (tablesRes.rows.some(r => r.table_name === 'offers')) {
            // Get columns for offers
            const columnsRes = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'offers';
        `);

            console.log('\nColumns in "offers":');
            columnsRes.rows.forEach(row => {
                console.log(`- ${row.column_name} (${row.data_type})`);
            });
        } else {
            console.log('❌ TABLE "offers" NOT FOUND among tables.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}

checkSchema();
