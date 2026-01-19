import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function crackConnection() {
    const commonPasswords = ['postgres', 'admin', 'root', '123456', 'password', ''];
    const host = '127.0.0.1';
    const port = 5433;
    const db = 'jewel';
    const user = 'postgres';

    for (const pwd of commonPasswords) {
        console.log(`Trying password: "${pwd}"`);
        const connectionString = `postgresql://${user}:${pwd}@${host}:${port}/${db}`;
        const pool = new pg.Pool({ connectionString, ssl: false });
        try {
            await pool.query("SELECT 1");
            console.log(`SUCCESS! Password is: "${pwd}"`);
            await pool.end();
            process.exit(0);
        } catch (err) {
            console.log(`Failed "${pwd}": ${err.message}`);
            await pool.end();
        }
    }
    console.log("None of the common passwords worked.");
}

crackConnection();
