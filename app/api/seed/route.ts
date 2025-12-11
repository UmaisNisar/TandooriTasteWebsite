import { NextResponse } from 'next/server';
import { contentBlockQueries, storeHoursQueries, reviewQueries, userQueries, categoryQueries, menuItemQueries, featuredDishQueries } from '@/lib/db-helpers';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

// Helper to add small delay between operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to ensure ContentBlock exists
async function ensureContentBlock(page: string, section: string, data: any) {
  try {
    const existing = await contentBlockQueries.findFirst({ page, section });

    if (!existing) {
      const result = await contentBlockQueries.upsert({
        page,
        section,
        content: data.content,
        order: data.order || 0
      });
      console.log(`✅ Created/Updated content block: ${page}/${section}`);
      await delay(100); // Small delay to avoid overwhelming connection
      return result;
    } else {
      console.log(`ℹ️  Content block already exists: ${page}/${section}`);
      return existing;
    }
  } catch (error: any) {
    console.error(`❌ Error creating content block ${page}/${section}:`, error.message);
    console.error(`   Error code:`, error.code);
    console.error(`   Error stack:`, error.stack);
    throw error;
  }
}

export async function GET() {
  const results = {
    contentBlocks: { created: 0, updated: 0, errors: 0 },
    storeHours: { created: 0, updated: 0, errors: 0 },
    reviews: { created: 0, skipped: 0, errors: 0 },
    categories: { created: 0, skipped: 0, errors: 0 },
    menuItems: { created: 0, skipped: 0, errors: 0 },
    featuredDishes: { created: 0, skipped: 0, errors: 0 },
    adminUser: { created: false, error: null }
  };

  try {
    console.log("🌱 Seeding database...");

    // Seed Homepage Content
    const homeBlocks = [
      {
        page: "home",
        section: "hero",
        content: JSON.stringify({
          title: "Fire-kissed tandoori and slow-cooked curries",
          subtitle:
            "Tandoori Tastes brings the warmth of Pakistani hospitality and charcoal-fired flavour to Northern Ontario.",
          cta1: "Order Now",
          cta2: "View Full Menu",
          imageUrl:
            "https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg?auto=compress&cs=tinysrgb&w=1200"
        }),
        order: 0
      },
      {
        page: "home",
        section: "why-choose-us",
        content: JSON.stringify({
          items: [
            {
              icon: "🔥",
              title: "Authentic Tandoor",
              description:
                "Traditional clay tandoor fired hot for smoky kebabs, naan and sizzling platters."
            },
            {
              icon: "🍛",
              title: "Slow-Cooked Curries",
              description:
                "Homestyle recipes simmered for hours with whole spices, tomatoes and ginger-garlic."
            },
            {
              icon: "🤍",
              title: "Warm Hospitality",
              description:
                "Family-run restaurant with a focus on thoughtful service and generous portions."
            }
          ]
        }),
        order: 1
      }
    ];

    console.log("📝 Seeding homepage content...");
    for (const block of homeBlocks) {
      try {
        const existing = await contentBlockQueries.findFirst({ page: block.page, section: block.section });
        await ensureContentBlock(block.page, block.section, block);
        if (existing) {
          results.contentBlocks.updated++;
        } else {
          results.contentBlocks.created++;
        }
      } catch (error: any) {
        console.error(`Failed to seed homepage block ${block.section}:`, error.message);
        results.contentBlocks.errors++;
      }
    }

    // Seed About Page Content
    const aboutBlocks = [
      {
        page: "about",
        section: "story",
        content:
          "Tandoori Tastes began as a family dream: to share the flavours of home with our friends and neighbours in Sudbury. From day one, we committed to cooking the way our parents and grandparents taught us—slowly, thoughtfully and with respect for every ingredient.\n\nOur kitchen leans into classic Pakistani techniques: charcoal tandoor for smoky kebabs and naan, hand-ground spice blends, and long-simmered gravies for depth and comfort. Each curry base is cooked in batches and finished to order, so your food arrives bright, balanced and hot.\n\nWe welcome everyone—from those discovering South Asian cuisine for the first time to guests who grew up eating it every day. Let us know your spice level and any dietary needs; we'll guide you to the right dishes.",
        order: 0
      },
      {
        page: "about",
        section: "chef",
        content:
          '"Cook with patience, season with intention, and never rush a good curry." Our kitchen is built on this simple rule.',
        order: 1
      },
      {
        page: "about",
        section: "mission",
        content:
          "We are proud to be part of Sudbury's diverse food scene and regularly support local events and fundraisers.",
        order: 2
      }
    ];

    console.log("📝 Seeding about page content...");
    for (const block of aboutBlocks) {
      try {
        const existing = await contentBlockQueries.findFirst({ page: block.page, section: block.section });
        await ensureContentBlock(block.page, block.section, block);
        if (existing) {
          results.contentBlocks.updated++;
        } else {
          results.contentBlocks.created++;
        }
      } catch (error: any) {
        console.error(`Failed to seed about block ${block.section}:`, error.message);
        results.contentBlocks.errors++;
      }
    }

    // Seed Contact Page Content
    const contactBlock = {
      page: "contact",
      section: "info",
      content: JSON.stringify({
        address: "96 Larch St\nGreater Sudbury, ON P3E 1C1",
        phone: "(705) 675-7777",
        email: "info@tandooritastes.ca",
        mapUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2803.8956487780884!2d-81.00288322396982!3d46.49318007111767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4d2f331b38f11bd5%3A0x9f7ce24954915a23!2sF2R4%2BHP%20Tandoori%20Tastes%2C%2096%20Larch%20St%2C%20Greater%20Sudbury%2C%20ON!5e0!3m2!1sen!2sca!4v1700000000002",
        hours: "Monday: Closed\nTuesday: 11:00am – 10:00pm\nWednesday: 11:00am – 10:00pm\nThursday: 11:00am – 10:00pm\nFriday: 11:00am – 10:00pm\nSaturday: 11:00am – 10:00pm\nSunday: 11:00am – 10:00pm",
        facebook: "",
        instagram: "",
        tiktok: ""
      }),
      order: 0
    };

    console.log("📝 Seeding contact page content...");
    try {
      const existing = await contentBlockQueries.findFirst({ page: contactBlock.page, section: contactBlock.section });
      await ensureContentBlock(contactBlock.page, contactBlock.section, contactBlock);
      if (existing) {
        results.contentBlocks.updated++;
      } else {
        results.contentBlocks.created++;
      }
    } catch (error: any) {
      console.error(`Failed to seed contact block:`, error.message);
      results.contentBlocks.errors++;
    }
    await delay(200);

    // Seed Store Hours
    const storeHours = [
      { dayOfWeek: 0, openTime: "11:00", closeTime: "22:00", isClosed: false }, // Sunday
      { dayOfWeek: 1, openTime: null, closeTime: null, isClosed: true }, // Monday
      { dayOfWeek: 2, openTime: "11:00", closeTime: "22:00", isClosed: false }, // Tuesday
      { dayOfWeek: 3, openTime: "11:00", closeTime: "22:00", isClosed: false }, // Wednesday
      { dayOfWeek: 4, openTime: "11:00", closeTime: "22:00", isClosed: false }, // Thursday
      { dayOfWeek: 5, openTime: "11:00", closeTime: "22:00", isClosed: false }, // Friday
      { dayOfWeek: 6, openTime: "11:00", closeTime: "22:00", isClosed: false } // Saturday
    ];

    console.log("🕐 Seeding store hours...");
    for (const hours of storeHours) {
      try {
        const existing = await storeHoursQueries.findUnique({ dayOfWeek: hours.dayOfWeek });
        await storeHoursQueries.upsert({
          dayOfWeek: hours.dayOfWeek,
          openTime: hours.openTime || undefined,
          closeTime: hours.closeTime || undefined,
          isClosed: hours.isClosed
        });
        if (existing) {
          results.storeHours.updated++;
        } else {
          results.storeHours.created++;
        }
        await delay(100);
      } catch (error: any) {
        console.error(`Error seeding store hours for day ${hours.dayOfWeek}:`, error.message);
        results.storeHours.errors++;
      }
    }
    await delay(200);

    // Seed Reviews
    const reviews = [
      {
        reviewerName: "Ayesha K.",
        reviewerImageUrl: undefined,
        rating: 5,
        text: "Reminds me of home. The karahi and naan are exactly like the dhabas in Pakistan.",
        isVisible: true
      },
      {
        reviewerName: "Michael R.",
        reviewerImageUrl: undefined,
        rating: 5,
        text: "The tandoori platter is unreal. Perfect for sharing and always cooked to perfection.",
        isVisible: true
      },
      {
        reviewerName: "Sarah & Tom",
        reviewerImageUrl: undefined,
        rating: 5,
        text: "They catered our small wedding and every guest still talks about the biryani.",
        isVisible: true
      }
    ];

    // Only create reviews if they don't exist (check by reviewer name)
    console.log("⭐ Seeding reviews...");
    for (const review of reviews) {
      try {
        const existing = await reviewQueries.findFirst({
          reviewerName: review.reviewerName,
          text: review.text
        });

        if (!existing) {
          await reviewQueries.create(review);
          results.reviews.created++;
          await delay(100);
        } else {
          results.reviews.skipped++;
        }
      } catch (error: any) {
        console.error(`Error creating review for ${review.reviewerName}:`, error.message);
        results.reviews.errors++;
      }
    }
    await delay(200);

    // Seed Categories
    const categories = [
      { name: "Appetizers", slug: "appetizers" },
      { name: "Tandoori Specialties", slug: "tandoori-specialties" },
      { name: "Curries & Gravies", slug: "curries-gravies" },
      { name: "Biryani & Rice", slug: "biryani-rice" },
      { name: "Bread & Naan", slug: "bread-naan" },
      { name: "Desserts", slug: "desserts" },
      { name: "Beverages", slug: "beverages" }
    ];

    console.log("📂 Seeding categories...");
    const categoryMap: Record<string, string> = {}; // Store category IDs by slug
    for (const cat of categories) {
      try {
        const existing = await categoryQueries.findUnique({ slug: cat.slug });
        if (!existing) {
          const created = await categoryQueries.create(cat);
          categoryMap[cat.slug] = created.id;
          results.categories.created++;
          console.log(`✅ Created category: ${cat.name}`);
        } else {
          categoryMap[cat.slug] = existing.id;
          results.categories.skipped++;
          console.log(`ℹ️  Category already exists: ${cat.name}`);
        }
        await delay(100);
      } catch (error: any) {
        console.error(`Error creating category ${cat.name}:`, error.message);
        results.categories.errors++;
      }
    }
    await delay(200);

    // Seed Menu Items (Pakistani Cuisine)
    const menuItems = [
      // Appetizers
      {
        name: "Samosas (2 pcs)",
        description: "Crispy pastry filled with spiced potatoes and peas, served with mint chutney.",
        price: 4.99,
        categorySlug: "appetizers",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        name: "Pakora Platter",
        description: "Assorted vegetable fritters (onion, potato, spinach) deep-fried in chickpea batter.",
        price: 7.99,
        categorySlug: "appetizers",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        name: "Chicken Tikka",
        description: "Tender chicken pieces marinated in yogurt and spices, grilled to perfection.",
        price: 12.99,
        categorySlug: "appetizers",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      // Tandoori Specialties
      {
        name: "Tandoori Chicken (Half)",
        description: "Half chicken marinated in yogurt, lemon, and aromatic spices, cooked in clay tandoor.",
        price: 16.99,
        categorySlug: "tandoori-specialties",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        name: "Seekh Kebab",
        description: "Minced lamb mixed with herbs and spices, skewered and grilled in tandoor.",
        price: 14.99,
        categorySlug: "tandoori-specialties",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        name: "Tandoori Mixed Grill",
        description: "Assorted kebabs including chicken tikka, seekh kebab, and boti kebab.",
        price: 24.99,
        categorySlug: "tandoori-specialties",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      // Curries & Gravies
      {
        name: "Butter Chicken",
        description: "Creamy tomato-based curry with tender chicken pieces, mild and flavorful.",
        price: 18.99,
        categorySlug: "curries-gravies",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        name: "Chicken Karahi",
        description: "Traditional Pakistani curry cooked in a wok with tomatoes, ginger, and green chilies.",
        price: 19.99,
        categorySlug: "curries-gravies",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        name: "Lamb Curry",
        description: "Tender lamb pieces slow-cooked in rich, aromatic curry sauce with whole spices.",
        price: 21.99,
        categorySlug: "curries-gravies",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        name: "Chana Masala",
        description: "Chickpeas cooked in tangy tomato gravy with onions, garlic, and aromatic spices.",
        price: 13.99,
        categorySlug: "curries-gravies",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      // Biryani & Rice
      {
        name: "Chicken Biryani",
        description: "Fragrant basmati rice layered with spiced chicken, saffron, and fried onions.",
        price: 17.99,
        categorySlug: "biryani-rice",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        name: "Lamb Biryani",
        description: "Aromatic basmati rice cooked with tender lamb, whole spices, and saffron.",
        price: 19.99,
        categorySlug: "biryani-rice",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        name: "Vegetable Biryani",
        description: "Mixed vegetables cooked with basmati rice, saffron, and aromatic spices.",
        price: 15.99,
        categorySlug: "biryani-rice",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      // Bread & Naan
      {
        name: "Plain Naan",
        description: "Freshly baked soft bread from the tandoor, perfect for dipping in curries.",
        price: 3.99,
        categorySlug: "bread-naan",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        name: "Garlic Naan",
        description: "Naan brushed with garlic butter and fresh cilantro, baked in tandoor.",
        price: 4.99,
        categorySlug: "bread-naan",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        name: "Butter Naan",
        description: "Soft naan brushed with butter, light and fluffy from the tandoor.",
        price: 4.49,
        categorySlug: "bread-naan",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      // Desserts
      {
        name: "Gulab Jamun (2 pcs)",
        description: "Sweet milk dumplings soaked in rose-scented sugar syrup, served warm.",
        price: 5.99,
        categorySlug: "desserts",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        name: "Kheer",
        description: "Creamy rice pudding flavored with cardamom, saffron, and topped with nuts.",
        price: 6.99,
        categorySlug: "desserts",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      // Beverages
      {
        name: "Mango Lassi",
        description: "Sweet and creamy yogurt drink blended with fresh mango pulp.",
        price: 4.99,
        categorySlug: "beverages",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        name: "Sweet Lassi",
        description: "Traditional yogurt drink sweetened with sugar and flavored with cardamom.",
        price: 3.99,
        categorySlug: "beverages",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    ];

    console.log("🍽️  Seeding menu items...");
    const menuItemMap: Record<string, string> = {}; // Store menu item IDs by name
    for (const item of menuItems) {
      try {
        const categoryId = categoryMap[item.categorySlug];
        if (!categoryId) {
          console.error(`Category not found for ${item.name}: ${item.categorySlug}`);
          results.menuItems.errors++;
          continue;
        }

        // Check if menu item already exists by name (check all items, not just category)
        const allItems = await menuItemQueries.findMany(undefined, false);
        const existingItem = allItems.find((mi: any) => mi.name === item.name && mi.categoryId === categoryId);
        
        if (!existingItem) {
          const created = await menuItemQueries.create({
            name: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
            categoryId: categoryId
          });
          menuItemMap[item.name] = created.id;
          results.menuItems.created++;
          console.log(`✅ Created menu item: ${item.name}`);
        } else {
          menuItemMap[item.name] = existingItem.id;
          results.menuItems.skipped++;
          console.log(`ℹ️  Menu item already exists: ${item.name}`);
        }
        await delay(100);
      } catch (error: any) {
        console.error(`Error creating menu item ${item.name}:`, error.message);
        results.menuItems.errors++;
      }
    }
    await delay(200);

    // Seed Featured Dishes (mark some popular items as featured)
    const featuredItems = [
      { name: "Chicken Biryani", order: 0 },
      { name: "Butter Chicken", order: 1 },
      { name: "Tandoori Chicken (Half)", order: 2 },
      { name: "Chicken Karahi", order: 3 }
    ];

    console.log("⭐ Seeding featured dishes...");
    for (const featured of featuredItems) {
      try {
        const menuItemId = menuItemMap[featured.name];
        if (!menuItemId) {
          console.error(`Menu item not found for featured dish: ${featured.name}`);
          results.featuredDishes.errors++;
          continue;
        }

        // Check if already featured
        const existingFeatured = await featuredDishQueries.findMany();
        const alreadyFeatured = existingFeatured.some((fd: any) => fd.menuItemId === menuItemId);
        
        if (!alreadyFeatured) {
          await featuredDishQueries.create({
            menuItemId: menuItemId,
            order: featured.order
          });
          results.featuredDishes.created++;
          console.log(`✅ Created featured dish: ${featured.name}`);
        } else {
          results.featuredDishes.skipped++;
          console.log(`ℹ️  Already featured: ${featured.name}`);
        }
        await delay(100);
      } catch (error: any) {
        console.error(`Error creating featured dish ${featured.name}:`, error.message);
        results.featuredDishes.errors++;
      }
    }
    await delay(200);

    // Seed initial admin user - delete existing and create fresh
    console.log("👤 Creating admin user...");
    try {
      await userQueries.deleteMany({ email: "admin" });
      await delay(200);

      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      await userQueries.create({
        email: "admin",
        password: hashedPassword,
        name: "Admin User",
        role: "ADMIN"
      });
      results.adminUser.created = true;
      console.log("✅ Admin user created successfully!");

      console.log("✅ Seeding completed!");
      console.log("📊 Results:", JSON.stringify(results, null, 2));
      
      return NextResponse.json({ 
        success: true, 
        message: 'Database seeded successfully! Admin user: admin / admin123',
        results: results
      });
    } catch (error: any) {
      console.error('Error creating admin user:', error.message);
      results.adminUser.error = error.message;
      throw error;
    }
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || String(error),
      results: results,
      hint: error.code === 'ENOTFOUND' 
        ? 'Database connection failed. Check DATABASE_URL in Vercel environment variables. Make sure you\'re using the correct Supabase connection string with ?sslmode=require'
        : 'Some data may have been seeded. Check the results object for details.'
    }, { status: 500 });
  }
}

