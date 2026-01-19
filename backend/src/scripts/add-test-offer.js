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

async function addTestOffer() {
    try {
        console.log('--- Adding Test Offer for Local Check ---');

        const offer = {
            shopName: "Local Test Jewellers",
            category: "Gold",
            discountType: "Percentage",
            discountValue: "20%",
            discountValueNumeric: 20,
            description: "Testing real-time approval flow.",
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            price: 50000,
            productTitle: "Test Diamond Ring",
            image: "https://images.unsplash.com/photo-1605100804763-247f67b3f41e?q=80&w=500",
            status: "approved", // Directly approving it for the test
            location_state: "Tamil Nadu",
            location_city: "Chennai",
            location_pincode: "600001"
        };

        const res = await pool.query(
            `INSERT INTO offers (
        shop_name, category, discount_type, discount_value, discount_value_numeric,
        description, valid_from, valid_until, price, product_title, image, status,
        location_state, location_city, location_pincode
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id`,
            [
                offer.shopName, offer.category, offer.discountType, offer.discountValue,
                offer.discountValueNumeric, offer.description, offer.validFrom, offer.validUntil,
                offer.price, offer.productTitle, offer.image, offer.status,
                offer.location_state, offer.location_city, offer.location_pincode
            ]
        );

        console.log(`✅ Success! Created Test Offer with ID: ${res.rows[0].id}`);
        console.log(`The status is set to 'approved', so it should show up on your Offers page now.`);

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

addTestOffer();
