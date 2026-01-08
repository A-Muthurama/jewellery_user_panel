import { forceFetch, getCurrentData } from "../src/services/metalPoller.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_FILE = path.join(__dirname, "../metal-cache.json");

async function testCache() {
    console.log("--- Starting Cache Test ---");

    // 1. Clear cache if exists for clean start
    if (fs.existsSync(CACHE_FILE)) {
        fs.unlinkSync(CACHE_FILE);
        console.log("Deleted existing cache file.");
    }

    // 2. First fetch - should call API (or fallback if no key)
    console.log("\nAttempting first fetch...");
    const data1 = await forceFetch();
    console.log("Data 1 updatedAt:", data1.updatedAt);

    if (!fs.existsSync(CACHE_FILE)) {
        console.error("FAILED: Cache file was not created.");
        return;
    }
    console.log("SUCCESS: Cache file created.");

    // 3. Second fetch - should use memory/cache
    console.log("\nAttempting second fetch immediately...");
    const data2 = await forceFetch();
    console.log("Data 2 updatedAt:", data2.updatedAt);

    if (data1.updatedAt === data2.updatedAt) {
        console.log("SUCCESS: Cache was reused (timestamps match).");
    } else {
        console.error("FAILED: Cache was not reused (timestamps differ).");
    }

    // 4. Test expiration (simulated)
    console.log("\nSimulating expired cache...");
    const raw = fs.readFileSync(CACHE_FILE, "utf-8");
    const cache = JSON.parse(raw);
    // Set timestamp to 24 hours ago
    cache.timestamp = Date.now() - (25 * 60 * 60 * 1000);
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));

    // We need to clear the in-memory lastFetch to force it to check the file or re-fetch
    // Since we can't easily reset internal module variables without export, 
    // we'll rely on the fact that startPoller or a fresh import would handle it.
    // In a real scenario, the server restarts and loads the old file.

    console.log("Cache file backdated by 24 hours.");
    console.log("Note: In-memory lastFetch still blocks immediate re-fetch in this script instance.");

    console.log("\n--- Test Complete ---");
}

testCache().catch(err => console.error("Test error:", err));
