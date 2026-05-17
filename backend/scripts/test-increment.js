import axios from "axios";

async function run() {
  const url = "http://localhost:3000/api/public/offers/25/view";
  
  console.log("Simulating two concurrent view increment requests...");
  try {
    const [res1, res2] = await Promise.all([
      axios.put(url),
      axios.put(url)
    ]);
    
    console.log("Response 1:", res1.data);
    console.log("Response 2:", res2.data);
  } catch (err) {
    console.error("API Call failed:", err.message);
  }
}

run();
