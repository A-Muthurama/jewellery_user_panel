import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function checkFullSchemaV2() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
    try {
        const tables = ['offers', 'vendors'];
        for (const table of tables) {
            const res = await pool.query(`
                SELECT column_name
                FROM information_schema.columns 
                WHERE table_name = '${table}'
                ORDER BY ordinal_position
            `);
            console.log(`--- ${table.toUpperCase()} ---`);
            res.rows.forEach(r => console.log(r.column_name));
        }
    } catch (err) {
        console.error(err.message);
    } finally {
        await pool.end();
    }
}

checkFullSchemaV2();
