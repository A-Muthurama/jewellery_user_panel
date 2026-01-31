# Vendor Information & Offer Data Format Specification

This document defines the data requirements for vendors on the JEWELLERS PARADISE platform. Vendors must provide both their shop profile information and individual offer details in the specified JSON format.

## 1. Vendor Shop Profile (KYC & Profile)
This data is required once during onboarding to set up the vendor's professional presence.

```json
{
  "shopName": "String (Required) - Official name of the jewellery shop",
  "ownerName": "String (Required) - Full name of the proprietor/director",
  "businessType": "String (Required) - e.g., 'Retailer', 'Wholesaler', 'Manufacturer'",
  "contact": {
    "mobile": "String (Required) - 10-digit number",
    "email": "String (Required) - Official business email",
    "whatsapp": "String (Optional) - Primary contact for buyers"
  },
  "location": {
    "state": "String (Required) - e.g., 'Tamil Nadu'",
    "city": "String (Required) - e.g., 'Chennai'",
    "area": "String (Required) - e.g., 'T. Nagar'",
    "pincode": "String (Required) - 6-digit code",
    "address": "String (Required) - Full shop address",
    "lat": "Number (Optional) - GPS Latitude",
    "lng": "Number (Optional) - GPS Longitude"
  },
  "verification": {
    "gstin": "String (Required) - GST Identification Number",
    "pan": "String (Required) - Business/Individual PAN",
    "bisHallmark": "String (Required) - BIS Hallmark registration number"
  },
  "branding": {
    "logo": "URL (Required) - Official shop logo (1:1)",
    "shopImage": "URL (Required) - Storefront photo (16:9)",
    "about": "String (Required) - Description of expertise (Max 500 chars)"
  },
  "socialLinks": {
    "instagram": "URL (Optional)",
    "facebook": "URL (Optional)",
    "website": "URL (Optional)"
  }
}
```

## 2. Offer Object Structure
Each individual offer submitted for display must follow this structure. Fields marked with `*` are reflected in the **Offer Details** page.

```json
{
  "productTitle": "String (Optional)* - Specific product name (e.g., '22K Gold Temple Necklace')",
  "shopName": "String (Required)* - Name of the jewellery shop",
  "location": {
    "state": "String (Required)*",
    "city": "String (Required)*",
    "area": "String (Required)* - Local area name",
    "pincode": "String (Required)"
  },
  "category": "String (Required)* - One of ['Gold', 'Diamond', 'Silver', 'Collections']",
  "discountType": "String (Required)* - e.g., 'Making Charges', 'Percentage', 'Flat Amount'",
  "discountValue": "String (Required)* - Display text (e.g., '0% Making Charges')",
  "discountValueNumeric": "Number (Required) - Numeric value for ranking (e.g., 0 or 20)",
  "description": "String (Required)* - Detailed offer description (Max 1000 chars)",
  "validFrom": "Date (YYYY-MM-DD)* - Start date of offer",
  "validUntil": "Date (YYYY-MM-DD)* - End date of offer",
  "image": "URL (Required)* - Main offer poster/image (16:9)",
  "videoUrl": "URL (Optional)* - Link to MP4 video of the product/offer",
  "buyLink": "URL (Optional)* - External link to checkout or shop website",
  "isFeatured": "Boolean (Optional) - Set to true for homepage promotion"
}
```

## 3. Full Example (Offer)
```json
{
  "productTitle": "Heritage Bridal Choker",
  "shopName": "Royal Jewellers",
  "location": {
    "state": "Maharashtra",
    "city": "Mumbai",
    "area": "Andheri West",
    "pincode": "400053"
  },
  "category": "Gold",
  "discountType": "Making Charges",
  "discountValue": "50% OFF on Making",
  "discountValueNumeric": 50,
  "description": "Exquisite handcrafted 22K gold choker with ruby embellishments. Limited period heritage collection offer.",
  "validFrom": "2025-01-01",
  "validUntil": "2025-02-28",
  "image": "https://example.com/images/choker-offer.jpg",
  "videoUrl": "https://example.com/videos/choker-showcase.mp4",
  "buyLink": "https://royaljewellers.test/products/heritage-choker",
  "isFeatured": true
}
```

