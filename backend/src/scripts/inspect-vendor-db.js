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

async function inspectDB() {
    try {
        console.log('--- Inspecting Database for Vendor Data ---');

        // 1. Check all schemas
        const schemas = await pool.query("SELECT schema_name FROM information_schema.schemata");
        console.log('Schemas:', schemas.rows.map(r => r.schema_name).join(', '));

        // 2. Check all tables in all non-system schemas
        const tables = await pool.query(`
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    `);
        console.log('\n--- All Tables ---');
        tables.rows.forEach(t => console.log(`- ${t.table_schema}.${t.table_name}`));

        // 3. See if there is ANY data in the 'offers' table we created
        const rows = await pool.query("SELECT * FROM offers");
        console.log(`\nRows in 'public.offers': ${rows.rowCount}`);
        if (rows.rowCount > 0) {
            rows.rows.forEach(r => console.log(`- ID: ${r.id}, Shop: ${r.shop_name}, Status: ${r.status}`));
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

inspectDB();
