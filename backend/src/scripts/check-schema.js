import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function checkOffersSchema() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'offers' 
            ORDER BY ordinal_position
        `);
        console.log("OFFERS TABLE COLUMNS:");
        res.rows.forEach(r => console.log(`- ${r.column_name} (${r.data_type})`));
    } catch (err) {
        console.error(err.message);
    } finally {
        await pool.end();
    }
}

checkOffersSchema();
