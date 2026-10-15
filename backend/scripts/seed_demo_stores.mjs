import pool from "../src/utils/db.js";

async function seed() {
  try {
    console.log("Seeding rich demo store data...");

    // 1. Enrich existing Store 1 (Tanishq) with gallery and offers
    const tanishqCheck = await pool.query(`SELECT id FROM "StoreListing" WHERE id = 1`);
    if (tanishqCheck.rows.length > 0) {
      await pool.query(`
        UPDATE "StoreListing" 
        SET 
          logo_url = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80',
          cover_photo_url = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
          short_description = 'India''s premier jewellery destination featuring exquisite 22K Hallmarked Gold, Solitaire Diamonds, and Bridal Polki masterpieces with lifetime exchange guarantee.',
          categories = ARRAY['Gold', 'Diamond', 'Bridal', 'Polki'],
          google_maps_link = 'https://maps.google.com/?q=Tanishq+Indiranagar+Bangalore',
          opening_hours = '10:30 AM - 08:30 PM',
          weekly_holiday = 'None (Open All 7 Days)'
        WHERE id = 1
      `);

      // Add gallery for Tanishq
      const galCount = await pool.query(`SELECT COUNT(*)::int as count FROM "StoreGallery" WHERE store_id = 1`);
      if (galCount.rows[0].count === 0) {
        await pool.query(`
          INSERT INTO "StoreGallery" (store_id, image_url, caption, display_order, created_at)
          VALUES 
            (1, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', 'Luxury Diamond Choker & Earring Suite', 0, NOW()),
            (1, 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80', '22K Traditional Bridal Gold Bangles', 1, NOW()),
            (1, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', 'Grand Flagship Showroom Indiranagar', 2, NOW()),
            (1, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', 'Polki Heritage Wedding Collection', 3, NOW())
        `);
      }

      // Add offers for Tanishq
      const offCount = await pool.query(`SELECT COUNT(*)::int as count FROM "StoreOffer" WHERE store_id = 1`);
      if (offCount.rows[0].count === 0) {
        await pool.query(`
          INSERT INTO "StoreOffer" (store_id, title, description, poster_url, start_date, end_date, terms, is_active, created_at, updated_at)
          VALUES 
            (1, 'Diwali Gold & Diamond Festival: Up to 25% Off Making Charges', 'Celebrate prosperity with festive savings across our certified 22K Gold and VVS-VS clarity diamond jewellery.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', 'Valid exclusively at Indiranagar showroom. Cannot be combined with other store promotions.', true, NOW(), NOW()),
            (1, 'Exchange Old Gold for 100% Value', 'Upgrade your heirloom gold for contemporary bridal masterpieces with zero melting loss on 22K jewellery.', 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'Standard karatmeter appraisal terms apply.', true, NOW(), NOW())
        `);
      }
    }

    // 2. Insert Malabar Gold & Diamonds if not present
    const malabarSlug = 'malabar-gold-mg-road-bangalore';
    const checkMalabar = await pool.query(`SELECT id FROM "StoreListing" WHERE slug = $1`, [malabarSlug]);
    if (checkMalabar.rows.length === 0) {
      const res = await pool.query(`
        INSERT INTO "StoreListing" (
          slug, store_name, logo_url, cover_photo_url, short_description, categories,
          address, city, state, pincode, google_maps_link, phone, whatsapp, website,
          social_links, opening_hours, weekly_holiday, status, is_verified,
          info_source, store_contact, photo_permissions, internal_notes, published_at, created_at, updated_at
        ) VALUES (
          '${malabarSlug}',
          'Malabar Gold & Diamonds — MG Road',
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=80',
          'Global jewellery leader showcasing exquisite bridal, antique temple ornaments, and certified diamonds with the 10 Malabar Promises.',
          ARRAY['Gold', 'Diamond', 'Temple Jewellery', 'Bridal'],
          'No. 45, Mahatma Gandhi Road, Shanthala Nagar, Ashok Nagar',
          'Bangalore',
          'Karnataka',
          '560001',
          'https://maps.google.com/?q=Malabar+Gold+MG+Road+Bangalore',
          '+91 80 2558 1916',
          '+91 9900012345',
          'https://www.malabargoldanddiamonds.com',
          '{"instagram": "https://instagram.com/malabargoldanddiamonds", "facebook": "https://facebook.com/malabargold"}'::jsonb,
          '10:00 AM - 09:00 PM',
          'None (Open All 7 Days)',
          'PUBLISHED',
          true,
          'Direct Showroom Manager',
          'Manager: Mr. Anil Kurup (+91 80 2558 1916)',
          'Brand Media Kit Authorized',
          'Flagship showroom verified.',
          NOW(), NOW(), NOW()
        ) RETURNING id
      `);
      const storeId = res.rows[0].id;

      await pool.query(`
        INSERT INTO "StoreGallery" (store_id, image_url, caption, display_order, created_at)
        VALUES 
          (${storeId}, 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80', 'Royal Bridal Temple Haram', 0, NOW()),
          (${storeId}, 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80', 'Solitaire Engagement Rings Showcase', 1, NOW()),
          (${storeId}, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80', 'Grand MG Road Showroom', 2, NOW())
      `);

      await pool.query(`
        INSERT INTO "StoreOffer" (store_id, title, description, poster_url, start_date, end_date, terms, is_active, created_at, updated_at)
        VALUES 
          (${storeId}, 'Bride of India Special: 0% Deduction on Gold Exchange', 'Get 100% value for your old 22K gold ornament exchange towards new bridal jewellery.', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'Terms apply. Valid on minimum purchase of Rs 1,00,000.', true, NOW(), NOW())
      `);
    }

    // 3. Insert Kalyan Jewellers Chennai if not present
    const kalyanSlug = 'kalyan-jewellers-t-nagar-chennai';
    const checkKalyan = await pool.query(`SELECT id FROM "StoreListing" WHERE slug = $1`, [kalyanSlug]);
    if (checkKalyan.rows.length === 0) {
      const res = await pool.query(`
        INSERT INTO "StoreListing" (
          slug, store_name, logo_url, cover_photo_url, short_description, categories,
          address, city, state, pincode, google_maps_link, phone, whatsapp, website,
          social_links, opening_hours, weekly_holiday, status, is_verified,
          info_source, store_contact, photo_permissions, internal_notes, published_at, created_at, updated_at
        ) VALUES (
          '${kalyanSlug}',
          'Kalyan Jewellers — T. Nagar',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
          'Traditional South Indian masterpieces, handcrafted Temple and Antique jewellery with BIS Hallmarking and 4-level quality assurance.',
          ARRAY['Temple Jewellery', 'Antique', 'Gold', 'Bridal'],
          'No. 88, Usman Road, T. Nagar',
          'Chennai',
          'Tamil Nadu',
          '600017',
          'https://maps.google.com/?q=Kalyan+Jewellers+Usman+Road+Chennai',
          '+91 44 2433 1155',
          '+91 9444012345',
          'https://www.kalyanjewellers.net',
          '{"instagram": "https://instagram.com/kalyanjewellers_official", "facebook": "https://facebook.com/kalyanjewellers"}'::jsonb,
          '10:00 AM - 09:00 PM',
          'None (Open All 7 Days)',
          'PUBLISHED',
          true,
          'Regional Office Chennai',
          'Manager: S. Ramanathan (+91 44 2433 1155)',
          'Approved',
          'Usman Road landmark branch verified.',
          NOW(), NOW(), NOW()
        ) RETURNING id
      `);
      const storeId = res.rows[0].id;

      await pool.query(`
        INSERT INTO "StoreGallery" (store_id, image_url, caption, display_order, created_at)
        VALUES 
          (${storeId}, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', 'Muhurat Bridal Antique Choker', 0, NOW()),
          (${storeId}, 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80', 'Handcrafted Lakshmi Kasu Malai', 1, NOW())
      `);

      await pool.query(`
        INSERT INTO "StoreOffer" (store_id, title, description, poster_url, start_date, end_date, terms, is_active, created_at, updated_at)
        VALUES 
          (${storeId}, 'Muhurat Wedding Gift: Free Gold Coin on Purchases', 'Receive a complimentary 1g gold coin on gold jewellery purchases over Rs 75,000.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'Valid till stock lasts at T. Nagar branch.', true, NOW(), NOW())
      `);
    }

    // 4. Insert TBZ Mumbai if not present
    const tbzSlug = 'tbz-the-original-zaveri-bazaar-mumbai';
    const checkTbz = await pool.query(`SELECT id FROM "StoreListing" WHERE slug = $1`, [tbzSlug]);
    if (checkTbz.rows.length === 0) {
      const res = await pool.query(`
        INSERT INTO "StoreListing" (
          slug, store_name, logo_url, cover_photo_url, short_description, categories,
          address, city, state, pincode, google_maps_link, phone, whatsapp, website,
          social_links, opening_hours, weekly_holiday, status, is_verified,
          info_source, store_contact, photo_permissions, internal_notes, published_at, created_at, updated_at
        ) VALUES (
          '${tbzSlug}',
          'TBZ — The Original (Tribhovandas Bhimji Zaveri)',
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=80',
          'Heritage legacy since 1864. Celebrated for high-end designer diamonds, uncut Polki jadau, and bespoke bridal heirloom suites.',
          ARRAY['Diamond', 'Polki', 'Kundan', 'Platinum'],
          '241/43, Zaveri Bazaar, Kalbadevi',
          'Mumbai',
          'Maharashtra',
          '400002',
          'https://maps.google.com/?q=TBZ+The+Original+Zaveri+Bazaar+Mumbai',
          '+91 22 2342 5001',
          '+91 9820012345',
          'https://www.tbztheoriginal.com',
          '{"instagram": "https://instagram.com/tbztheoriginal", "facebook": "https://facebook.com/tbztheoriginal"}'::jsonb,
          '11:00 AM - 08:00 PM',
          'Sunday',
          'PUBLISHED',
          true,
          'Zaveri Bazaar Association',
          'Contact: Mr. Hitesh Zaveri (+91 22 2342 5001)',
          'Granted',
          'Historic flagship Zaveri Bazaar showroom verified.',
          NOW(), NOW(), NOW()
        ) RETURNING id
      `);
      const storeId = res.rows[0].id;

      await pool.query(`
        INSERT INTO "StoreGallery" (store_id, image_url, caption, display_order, created_at)
        VALUES 
          (${storeId}, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', 'Bespoke Uncut Polki & Emerald Choker', 0, NOW()),
          (${storeId}, 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80', 'Certified Solitaire Collection Suite', 1, NOW())
      `);

      await pool.query(`
        INSERT INTO "StoreOffer" (store_id, title, description, poster_url, start_date, end_date, terms, is_active, created_at, updated_at)
        VALUES 
          (${storeId}, 'Solitaire Sparkle Privilege: 100% Certified Buyback', 'Enjoy zero depreciation on diamond solitaire upgrades and exchange.', 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80', CURRENT_DATE, CURRENT_DATE + INTERVAL '120 days', 'IGI / GIA certified solitaire stones only.', true, NOW(), NOW())
      `);
    }

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await pool.end();
  }
}

seed();
