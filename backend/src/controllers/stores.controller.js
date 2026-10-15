import pool from "../utils/db.js";

const DISCLAIMER_TEXT =
  "JewellersParadise is a jewellery offers discovery platform. Purchases and enquiries are handled directly by the jeweller. Please confirm offer availability and terms with the store.";

// Helper to map DB row to safe public store shape (hiding private admin audit fields)
const mapPublicStore = (row) => ({
  id: row.id,
  slug: row.slug,
  storeName: row.store_name,
  logoUrl: row.logo_url,
  coverPhotoUrl: row.cover_photo_url,
  shortDescription: row.short_description || "",
  categories: Array.isArray(row.categories)
    ? row.categories
    : (row.categories ? [row.categories] : []),
  address: row.address,
  city: row.city,
  state: row.state,
  pincode: row.pincode,
  googleMapsLink: row.google_maps_link || null,
  phone: row.phone,
  whatsapp: row.whatsapp || null,
  website: row.website || null,
  socialLinks: typeof row.social_links === "object" ? row.social_links : null,
  openingHours: row.opening_hours || null,
  weeklyHoliday: row.weekly_holiday || null,
  status: row.status,
  isVerified: Boolean(row.is_verified),
  publishedAt: row.published_at,
  updatedAt: row.updated_at,
  createdAt: row.created_at,
  galleryCount: parseInt(row.gallery_count || 0, 10),
  offersCount: parseInt(row.offers_count || 0, 10),
});

// GET /api/public/stores
// Search and filter stores by name, city, state, category, verified status
export const getStores = async (req, res) => {
  try {
    const {
      search,
      city,
      state,
      category,
      isVerified,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    let conditions = [`s.status = 'PUBLISHED'`];
    let params = [];

    // Search by name, city, state, or address
    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      const pIdx = params.length;
      conditions.push(
        `(s.store_name ILIKE $${pIdx} OR s.city ILIKE $${pIdx} OR s.state ILIKE $${pIdx} OR s.address ILIKE $${pIdx})`
      );
    }

    // City filter
    if (city && city.trim() && city !== "ALL") {
      params.push(city.trim());
      conditions.push(`LOWER(s.city) = LOWER($${params.length})`);
    }

    // State filter
    if (state && state.trim() && state !== "ALL") {
      params.push(state.trim());
      conditions.push(`LOWER(s.state) = LOWER($${params.length})`);
    }

    // Category filter (array match)
    if (category && category.trim() && category !== "ALL") {
      params.push(category.trim());
      conditions.push(`$${params.length} = ANY(s.categories)`);
    }

    // Verified Jeweller filter
    if (isVerified === "true" || isVerified === true) {
      conditions.push(`s.is_verified = true`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // Total count query
    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM "StoreListing" s
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, params);
    const total = countResult.rows[0]?.total || 0;

    // Data query with subqueries for gallery & active offers count
    const dataQuery = `
      SELECT 
        s.id,
        s.slug,
        s.store_name,
        s.logo_url,
        s.cover_photo_url,
        s.short_description,
        s.categories,
        s.address,
        s.city,
        s.state,
        s.pincode,
        s.google_maps_link,
        s.phone,
        s.whatsapp,
        s.website,
        s.social_links,
        s.opening_hours,
        s.weekly_holiday,
        s.status,
        s.is_verified,
        s.published_at,
        s.updated_at,
        s.created_at,
        (SELECT COUNT(*)::int FROM "StoreGallery" g WHERE g.store_id = s.id) AS gallery_count,
        (SELECT COUNT(*)::int FROM "StoreOffer" o 
         WHERE o.store_id = s.id 
           AND o.is_active = true 
           AND (o.end_date >= CURRENT_DATE OR o.end_date IS NULL)) AS offers_count
      FROM "StoreListing" s
      ${whereClause}
      ORDER BY s.is_verified DESC, s.updated_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const dataResult = await pool.query(dataQuery, [...params, limitNum, offset]);

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: dataResult.rows.map(mapPublicStore),
    });
  } catch (error) {
    console.error("Error in getStores:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch jewellery stores" });
  }
};

// GET /api/public/stores/meta/filters
// Returns available cities, states, and categories from published stores
export const getStoreFilters = async (req, res) => {
  try {
    // Distinct cities
    const cityRes = await pool.query(`
      SELECT DISTINCT city FROM "StoreListing" 
      WHERE status = 'PUBLISHED' AND city IS NOT NULL AND city != ''
      ORDER BY city ASC
    `);

    // Distinct states
    const stateRes = await pool.query(`
      SELECT DISTINCT state FROM "StoreListing" 
      WHERE status = 'PUBLISHED' AND state IS NOT NULL AND state != ''
      ORDER BY state ASC
    `);

    // Distinct categories (unnest array)
    const catRes = await pool.query(`
      SELECT DISTINCT unnest(categories) AS category 
      FROM "StoreListing" 
      WHERE status = 'PUBLISHED' AND categories IS NOT NULL
      ORDER BY category ASC
    `);

    res.json({
      success: true,
      cities: cityRes.rows.map((r) => r.city),
      states: stateRes.rows.map((r) => r.state),
      categories: catRes.rows.map((r) => r.category).filter(Boolean),
    });
  } catch (error) {
    console.error("Error in getStoreFilters:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch store filter metadata" });
  }
};

// GET /api/public/stores/:slugOrId
// Return single store profile with gallery and active offers only (hiding expired offers)
export const getStoreBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const isId = !isNaN(Number(slugOrId));

    const storeQuery = `
      SELECT 
        s.id,
        s.slug,
        s.store_name,
        s.logo_url,
        s.cover_photo_url,
        s.short_description,
        s.categories,
        s.address,
        s.city,
        s.state,
        s.pincode,
        s.google_maps_link,
        s.phone,
        s.whatsapp,
        s.website,
        s.social_links,
        s.opening_hours,
        s.weekly_holiday,
        s.status,
        s.is_verified,
        s.published_at,
        s.updated_at,
        s.created_at
      FROM "StoreListing" s
      WHERE ${isId ? "s.id = $1" : "s.slug = $1"}
        AND s.status = 'PUBLISHED'
      LIMIT 1
    `;

    const storeResult = await pool.query(storeQuery, [isId ? Number(slugOrId) : slugOrId]);

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Store listing not found or not currently active",
      });
    }

    const storeData = mapPublicStore(storeResult.rows[0]);

    // Fetch Gallery items
    const galleryResult = await pool.query(
      `SELECT id, image_url, caption, display_order 
       FROM "StoreGallery" 
       WHERE store_id = $1 
       ORDER BY display_order ASC, id ASC`,
      [storeData.id]
    );

    // Fetch Active Offers (Hiding expired offers: end_date >= CURRENT_DATE or end_date IS NULL)
    const offersResult = await pool.query(
      `SELECT id, title, description, poster_url, start_date, end_date, terms, is_active, created_at
       FROM "StoreOffer"
       WHERE store_id = $1
         AND is_active = true
         AND (end_date >= CURRENT_DATE OR end_date IS NULL)
       ORDER BY end_date ASC NULLS LAST, created_at DESC`,
      [storeData.id]
    );

    const offers = offersResult.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      posterUrl: row.poster_url,
      startDate: row.start_date,
      endDate: row.end_date,
      terms: row.terms,
      isActive: row.is_active,
      createdAt: row.created_at,
    }));

    const gallery = galleryResult.rows.map((row) => ({
      id: row.id,
      imageUrl: row.image_url,
      caption: row.caption,
      displayOrder: row.display_order,
    }));

    res.json({
      success: true,
      store: {
        ...storeData,
        gallery,
        offers,
        disclaimer: DISCLAIMER_TEXT,
      },
    });
  } catch (error) {
    console.error("Error in getStoreBySlugOrId:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch store profile" });
  }
};

// POST /api/public/stores/:id/claim
// Allows store owners to submit a claim request
export const createClaimRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const storeId = parseInt(id, 10);
    const {
      claimantName,
      claimantPhone,
      claimantEmail,
      proofType = "Business License / GSTIN",
      proofDocUrl = null,
      notes = "",
    } = req.body;

    if (!claimantName || !claimantPhone || !claimantEmail) {
      return res.status(400).json({
        success: false,
        error: "Name, phone number, and email are required to submit a claim.",
      });
    }

    // Verify store exists
    const checkStore = await pool.query(
      `SELECT id, store_name FROM "StoreListing" WHERE id = $1`,
      [storeId]
    );
    if (checkStore.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Store listing not found." });
    }

    const insertQuery = `
      INSERT INTO "StoreClaimRequest" 
        (store_id, claimant_name, claimant_phone, claimant_email, proof_type, proof_doc_url, notes, status, created_at)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, 'PENDING', NOW())
      RETURNING id, created_at
    `;

    const result = await pool.query(insertQuery, [
      storeId,
      claimantName.trim(),
      claimantPhone.trim(),
      claimantEmail.trim().toLowerCase(),
      proofType,
      proofDocUrl,
      notes ? notes.trim() : null,
    ]);

    res.status(201).json({
      success: true,
      message:
        "Your claim request has been received. Our verification team will review your details and contact you shortly.",
      claimId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error in createClaimRequest:", error.message);
    res.status(500).json({ success: false, error: "Failed to submit claim request." });
  }
};

// POST /api/public/stores/:id/report
// Allows users to report incorrect details
export const createReportRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const storeId = parseInt(id, 10);
    const {
      reportType = "Incorrect Information",
      description,
      reportedByEmail = null,
    } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please provide details about what needs correction.",
      });
    }

    // Verify store exists
    const checkStore = await pool.query(
      `SELECT id, store_name FROM "StoreListing" WHERE id = $1`,
      [storeId]
    );
    if (checkStore.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Store listing not found." });
    }

    const insertQuery = `
      INSERT INTO "StoreReportRequest"
        (store_id, report_type, description, reported_by_email, status, created_at)
      VALUES
        ($1, $2, $3, $4, 'PENDING', NOW())
      RETURNING id, created_at
    `;

    const result = await pool.query(insertQuery, [
      storeId,
      reportType,
      description.trim(),
      reportedByEmail ? reportedByEmail.trim().toLowerCase() : null,
    ]);

    res.status(201).json({
      success: true,
      message:
        "Thank you for reporting. Our moderation team will verify the details and update the listing promptly.",
      reportId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error in createReportRequest:", error.message);
    res.status(500).json({ success: false, error: "Failed to submit report." });
  }
};
