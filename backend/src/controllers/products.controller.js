import pool from "../utils/db.js";

// Helper: map "Product" table row -> frontend shape
const mapProductRow = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description || "",
  // Collect image1_url and image2_url into an array, skipping nulls
  images: [row.image1_url, row.image2_url].filter(Boolean),
  affiliateUrl: row.affiliate_url || "",
  createdAt: row.created_at,
});

// GET /api/public/products
// Returns all products from the admin-managed "Product" table (Prisma PascalCase)
export const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, image1_url, image2_url, affiliate_url, created_at
       FROM "Product"
       ORDER BY created_at DESC`
    );

    res.json(result.rows.map(mapProductRow));
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// GET /api/public/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, title, description, image1_url, image2_url, affiliate_url, created_at
       FROM "Product" WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(mapProductRow(result.rows[0]));
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};


// GET /api/public/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, title, description, image1_url, image2_url, affiliate_url, created_at
       FROM "Product" WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(mapProductRow(result.rows[0]));
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};
