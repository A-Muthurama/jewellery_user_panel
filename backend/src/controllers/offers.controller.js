import pool from "../utils/db.js";

// Helper to map DB row to frontend requirement format
const mapOfferRow = (row) => ({
  id: row.id,
  title: row.title,
  shopName: row.shop_name || 'Jewellery Shop',
  category: row.category || 'All',
  discountType: row.discount_type || 'Offer',
  discountLabel: row.discount_label || '',
  discountValueNumeric: parseFloat(row.discount_value_numeric || 0),
  description: row.description,
  image: row.poster_url || '',
  location: {
    state: row.state || "Tamil Nadu",
    city: row.city || "Chennai",
    pincode: row.pincode || "",
    address: row.address || "",
    country: row.country || "India"
  },
  validUntil: row.end_date,
  validFrom: row.start_date,
  createdAt: row.created_at || new Date(),
  videoUrl: row.video_url || '',
  buyLink: row.buy_link || '',
  likeCount: parseInt(row.like_count || 0),
  viewCount: parseInt(row.view_count || 0)
});

// GET /api/public/offers
// Returns only APPROVED and non-expired offers
export const getOffers = async (req, res) => {
  try {
    const { category, country, state, city, pincode, sort } = req.query;

    let selectFields = [
      'o.id',
      'o.title',
      'v.shop_name',
      'o.description',
      'o.poster_url',
      'o.video_url',
      'o.category',
      'o.start_date',
      'o.end_date',
      'o.discount_type',
      'o.discount_label',
      'o.buy_link',
      'o.status',
      'o.like_count',
      'v.state',
      'v.city',
      'v.address',
      'v.pincode',
      'v.country',
      'o.discount_value_numeric',
      'o.view_count'
    ].join(', ');

    let query = `
      SELECT ${selectFields}
      FROM offers o
      JOIN vendors v ON o.vendor_id = v.id
      WHERE LOWER(o.status) = 'approved'
    `;
    const params = [];

    // Filter by end_date
    query += ` AND (o.end_date >= CURRENT_DATE OR o.end_date IS NULL)`;

    // Dynamic Filters
    if (category && category !== 'All') {
      params.push(category);
      query += ` AND o.category = $${params.length}`;
    }
    if (country) {
      params.push(country);
      query += ` AND v.country = $${params.length}`;
    }
    if (state) {
      params.push(state);
      query += ` AND v.state = $${params.length}`;
    }
    if (city) {
      params.push(city);
      query += ` AND v.city = $${params.length}`;
    }
    if (pincode) {
      params.push(pincode + '%');
      query += ` AND v.pincode LIKE $${params.length}`;
    }

    // Sorting
    if (sort === 'discount_high') {
      query += ` ORDER BY o.discount_value_numeric DESC NULLS LAST`;
    } else {
      query += ` ORDER BY o.created_at DESC`;
    }

    const result = await pool.query(query, params);
    const offers = result.rows.map(mapOfferRow);

    res.json(offers);
  } catch (error) {
    console.error("Error fetching public offers:", error.message);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
};

// GET /api/public/offers/:id
export const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;

    let selectFields = [
      'o.id',
      'o.title',
      'v.shop_name',
      'o.description',
      'o.poster_url',
      'o.video_url',
      'o.category',
      'o.start_date',
      'o.end_date',
      'o.discount_type',
      'o.discount_label',
      'o.buy_link',
      'o.status',
      'o.like_count',
      'v.state',
      'v.city',
      'v.address',
      'v.pincode',
      'v.country',
      'o.discount_value_numeric',
      'o.view_count'
    ].join(', ');

    const result = await pool.query(`
      SELECT ${selectFields}
      FROM offers o
      JOIN vendors v ON o.vendor_id = v.id
      WHERE o.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }

    res.json(mapOfferRow(result.rows[0]));
  } catch (error) {
    console.error("Error fetching public offer detail:", error.message);
    res.status(500).json({ error: "Failed to fetch offer details" });
  }
};

// PUT /api/public/offers/:id/toggle-like
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const offerId = parseInt(id);

    if (isNaN(offerId)) {
      return res.status(400).json({ error: "Invalid offer ID" });
    }

    let query = "";
    if (action === "unlike") {
      query = "UPDATE offers SET like_count = GREATEST(0, like_count - 1) WHERE id = $1 RETURNING like_count";
    } else {
      query = "UPDATE offers SET like_count = COALESCE(like_count, 0) + 1 WHERE id = $1 RETURNING like_count";
    }

    const result = await pool.query(query, [offerId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }

    res.json({ id: offerId, likeCount: result.rows[0].like_count });
  } catch (error) {
    console.error("Error toggling like:", error.message);
    res.status(500).json({ error: "Failed to update like count" });
  }
};

// PUT /api/public/offers/:id/view
// Server-side IP deduplication: only 1 view per IP per offer per calendar day (UTC)
// Guaranteed race-condition proof by using database-level UNIQUE PRIMARY KEY constraint
export const incrementView = async (req, res) => {
  try {
    const { id } = req.params;
    const offerId = parseInt(id);

    if (isNaN(offerId)) {
      return res.status(400).json({ error: "Invalid offer ID" });
    }

    // Extract real client IP
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      "unknown";

    // Attempt to insert view. If already exists for (offer_id, ip_address, view_date), DO NOTHING.
    const insertResult = await pool.query(
      `INSERT INTO offer_views (offer_id, ip_address)
       VALUES ($1, $2)
       ON CONFLICT (offer_id, ip_address, view_date) DO NOTHING
       RETURNING 1`,
      [offerId, clientIp]
    );

    // If no row was inserted, it was already viewed today
    if (insertResult.rows.length === 0) {
      const current = await pool.query(
        "SELECT view_count FROM offers WHERE id = $1",
        [offerId]
      );
      if (current.rows.length === 0) {
        return res.status(404).json({ error: "Offer not found" });
      }
      return res.json({
        id: offerId,
        viewCount: current.rows[0].view_count,
        counted: false
      });
    }

    // Successfully inserted -> Increment unique view count
    const result = await pool.query(
      "UPDATE offers SET view_count = COALESCE(view_count, 0) + 1 WHERE id = $1 RETURNING view_count",
      [offerId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }

    res.json({
      id: offerId,
      viewCount: result.rows[0].view_count,
      counted: true
    });
  } catch (error) {
    console.error("Error incrementing view:", error.message);
    res.status(500).json({ error: "Failed to update view count" });
  }
};

// Admin endpoints
export const getAllOffers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM offers ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
};

export const createOffer = async (req, res) => { res.status(501).json({ error: "Not implemented for this schema yet" }); };
export const updateOffer = async (req, res) => { res.status(501).json({ error: "Not implemented for this schema yet" }); };
export const deleteOffer = async (req, res) => { res.status(501).json({ error: "Not implemented for this schema yet" }); };
