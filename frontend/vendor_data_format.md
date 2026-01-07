# Vendor Offer Data Format specification

This document defines the required JSON format for vendors to submit their offers to the Project J platform.

## Offer Object Structure
Each offer must follow this structure:

```json
{
  "shopName": "String (Required) - Name of the jewellery shop",
  "location": {
    "state": "String (Required) - e.g., 'Maharashtra'",
    "city": "String (Required) - e.g., 'Mumbai'",
    "pincode": "String (Required) - 6 digit pincode",
    "lat": "Number (Optional) - Latitude",
    "lng": "Number (Optional) - Longitude"
  },
  "category": "String (Required) - One of ['Gold', 'Diamond', 'Silver', 'Collections']",
  "discountType": "String (Required) - e.g., 'Percentage', 'Flat Amount', 'Buy 1 Get 1'",
  "discountValue": "String (Required) - Display text e.g., '20% OFF'",
  "discountValueNumeric": "Number (Required) - Numeric value for sorting (e.g., 20 or 5000)",
  "price": "Number (Optional) - Base price if applicable",
  "description": "String (Required) - Max 200 characters description of the offer",
  "validUntil": "Date String (YYYY-MM-DD)",
  "image": "URL (Required) - Link to the offer poster image (Aspect ratio 16:9 recommended)",
  "isFeatured": "Boolean (Optional) - Default false"
}
```

## Example
```json
{
  "shopName": "Royal Jewellers",
  "location": {
    "state": "Maharashtra",
    "city": "Pune",
    "pincode": "411001"
  },
  "category": "Gold",
  "discountType": "Flat Amount",
  "discountValue": "₹1000 OFF",
  "discountValueNumeric": 1000,
  "description": "Flat ₹1000 discount on purchase of 10g Gold Coin.",
  "validUntil": "2025-02-28",
  "image": "https://example.com/posters/gold-coin-offer.jpg"
}
```
