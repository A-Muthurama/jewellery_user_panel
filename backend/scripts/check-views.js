import pool from "../src/utils/db.js";

async function run() {
  try {
    const offerViews = await pool.query("SELECT * FROM offer_views ORDER BY view_date DESC LIMIT 20");
    console.log("RECENT OFFER VIEWS:");
    console.log(offerViews.rows);

    const offers = await pool.query("SELECT id, title, view_count, like_count FROM offers ORDER BY id ASC");
    console.log("\nOFFERS:");
    console.log(offers.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

run();
