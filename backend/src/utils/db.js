import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded before using process.env
dotenv.config({ path: path.join(__dirname, "../../.env") });

const { Pool } = pg;

// Debug: Check which connection method is being used
console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
console.log("Using Neon:", process.env.DATABASE_URL ? "YES" : "NO");

// Create connection pool - prioritize DATABASE_URL for Neon
let pool;

if (process.env.DATABASE_URL) {
  console.log("DB_DEBUG: Raw DATABASE_URL:", process.env.DATABASE_URL.replace(/:([^@]+)@/, ":****@"));
  // Check if it's a local connection
  const isLocal = process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1");

  console.log(`DB_DEBUG: Using DATABASE_URL (${isLocal ? "Local" : "Remote/Neon"})...`);

  const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    // Disable SSL for local connections to avoid handshake errors
    ssl: isLocal ? false : { rejectUnauthorized: false }
  };
  console.log("DB_DEBUG: Created Pool with config:", { ...poolConfig, connectionString: poolConfig.connectionString.replace(/:([^@]+)@/, ":****@") });

  pool = new Pool(poolConfig);
} else {
  // Use local database credentials
  console.log("DB_DEBUG: No DATABASE_URL, using granular credentials...");
  pool = new Pool({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "jewel_db"
  });
}

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// Initialize database (create/update tables to match API expectations)
export const initializeDatabase = async () => {
  try {
    console.log("DB_DEBUG: Ensuring schema consistency...");

    // 1. Ensure vendors table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vendors (
        id SERIAL PRIMARY KEY,
        shop_name VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        state VARCHAR(100),
        city VARCHAR(100),
        pincode VARCHAR(10),
        address TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Ensure offers table exists with correct columns
    await pool.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id SERIAL PRIMARY KEY,
        vendor_id INTEGER REFERENCES vendors(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        poster_url TEXT,
        video_url TEXT,
        category VARCHAR(100),
        start_date DATE,
        end_date DATE,
        discount_type VARCHAR(50),
        discount_label VARCHAR(100),
        discount_value_numeric NUMERIC,
        buy_link TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        like_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Add any missing columns to existing tables (Safety check for migration)
    const tableColumns = {
      offers: [
        { name: 'discount_label', type: 'VARCHAR(100)' },
        { name: 'discount_value_numeric', type: 'NUMERIC' },
        { name: 'like_count', type: 'INTEGER DEFAULT 0' },
        { name: 'poster_url', type: 'TEXT' }
      ]
    };

    for (const [table, columns] of Object.entries(tableColumns)) {
      for (const col of columns) {
        await pool.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='${table}' AND column_name='${col.name}') THEN
              ALTER TABLE ${table} ADD COLUMN ${col.name} ${col.type};
            END IF;
          END $$;
        `);
      }
    }

    console.log("Database schema is synchronized and Cloud-Ready.");
  } catch (err) {
    console.error("Error during database initialization:", err.message);
  }
};

export default pool;
