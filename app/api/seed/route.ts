import { NextResponse } from 'next/server';
import { contentBlockQueries, storeHoursQueries, reviewQueries, userQueries } from '@/lib/db-helpers';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

// Helper function to ensure ContentBlock exists
async function ensureContentBlock(page: string, section: string, data: any) {
  const existing = await contentBlockQueries.findFirst({ page, section });

  if (!existing) {
    await contentBlockQueries.upsert({
      page,
      section,
      content: data.content,
      order: data.order || 0
    });
  }
}

export async function GET() {
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

    for (const block of homeBlocks) {
      await ensureContentBlock(block.page, block.section, block);
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

    for (const block of aboutBlocks) {
      await ensureContentBlock(block.page, block.section, block);
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

    await ensureContentBlock(contactBlock.page, contactBlock.section, contactBlock);

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

    for (const hours of storeHours) {
      await storeHoursQueries.upsert({
        dayOfWeek: hours.dayOfWeek,
        openTime: hours.openTime || undefined,
        closeTime: hours.closeTime || undefined,
        isClosed: hours.isClosed
      });
    }

    // Seed Reviews
    const reviews = [
      {
        reviewerName: "Ayesha K.",
        reviewerImageUrl: null,
        rating: 5,
        text: "Reminds me of home. The karahi and naan are exactly like the dhabas in Pakistan.",
        isVisible: true
      },
      {
        reviewerName: "Michael R.",
        reviewerImageUrl: null,
        rating: 5,
        text: "The tandoori platter is unreal. Perfect for sharing and always cooked to perfection.",
        isVisible: true
      },
      {
        reviewerName: "Sarah & Tom",
        reviewerImageUrl: null,
        rating: 5,
        text: "They catered our small wedding and every guest still talks about the biryani.",
        isVisible: true
      }
    ];

    // Only create reviews if they don't exist (check by reviewer name)
    for (const review of reviews) {
      const existing = await reviewQueries.findFirst({
        reviewerName: review.reviewerName,
        text: review.text
      });

      if (!existing) {
        await reviewQueries.create(review);
      }
    }

    // Seed initial admin user - delete existing and create fresh
    await userQueries.deleteMany({ email: "admin" });

    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    await userQueries.create({
      email: "admin",
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN"
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully! Admin user: admin / admin123' 
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ 
      error: String(error) 
    }, { status: 500 });
  }
}

