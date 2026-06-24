import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://neondb_owner:npg_C2hmGVoTsr3E@ep-noisy-sound-ah3tjpti-pooler.c-3.us-east-1.aws.neon.tech/neondb",
  ssl: { rejectUnauthorized: false }
});

// Check Product table columns
const cols = await pool.query(`
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'Product' 
  ORDER BY ordinal_position
`);
console.log("Product TABLE COLUMNS:", JSON.stringify(cols.rows, null, 2));

// Check rows
const rows = await pool.query('SELECT * FROM "Product" LIMIT 5');
console.log("Product ROWS:", JSON.stringify(rows.rows, null, 2));

await pool.end();
