import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we pick up the .env file from backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("Checking DB Connection...");
        console.log("DB URL (masked): " + (process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + "..." : "MISSING"));

        // 1. Check existing offers
        const res = await pool.query("SELECT id, shop_name, status, product_title FROM offers");
        console.log(`Connection Successful. Total Offers: ${res.rowCount}`);

        if (res.rowCount === 0) {
            console.log("No offers found! You might need to seed data.");
        } else {
            res.rows.forEach(r => console.log(`ID: ${r.id}, Shop: ${r.shop_name}, Status: ${r.status}`));

            // 2. Count non-approved
            const nonApproved = res.rows.filter(r => !r.status || r.status.toUpperCase() !== 'APPROVED');

            if (nonApproved.length > 0) {
                console.log(`Found ${nonApproved.length} offers that are NOT approved. Fixing them...`);

                // 3. Update them
                const updateRes = await pool.query("UPDATE offers SET status = 'APPROVED' WHERE status IS DISTINCT FROM 'APPROVED'");
                console.log(`Updated ${updateRes.rowCount} offers to 'APPROVED'.`);
            } else {
                console.log("All offers are verified as APPROVED.");
            }
        }

    } catch (err) {
        console.error("DB Connection ERROR:", err.message);
        if (err.code === 'ENOTFOUND') {
            console.error("--> FATAL: Your computer cannot resolve the Neon Database hostname.");
            console.error("--> Please check your internet connection or try changing your DNS to 8.8.8.8.");
        }
    } finally {
        await pool.end();
    }
}

run();
