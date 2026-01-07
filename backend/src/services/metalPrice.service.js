import axios from "axios";

const API_URL = "https://api.metalpriceapi.com/v1/latest";

export const fetchMetalRates = async () => {
  const res = await axios.get(API_URL, {
    params: {
      api_key: process.env.METAL_PRICE_API_KEY,
      base: "USD",
      currencies: "XAU,XAG,XPT,INR"
    }
  });

  console.log("API Response (USD Base):", JSON.stringify(res.data, null, 2));
  return res.data.rates;
};
