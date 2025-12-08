import { query } from '../lib/db';
import { userQueries, categoryQueries, contentBlockQueries, storeHoursQueries } from '../lib/db-helpers';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const existingAdmin = await userQueries.findUnique({ email: 'admin' });
    
    if (!existingAdmin) {
      await userQueries.create({
        email: 'admin',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN'
      });
      console.log('✅ Admin user created (email: admin, password: admin123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create sample categories
    const categories = [
      { name: 'Appetizers', slug: 'appetizers' },
      { name: 'Main Courses', slug: 'main-courses' },
      { name: 'Desserts', slug: 'desserts' },
      { name: 'Beverages', slug: 'beverages' }
    ];

    for (const cat of categories) {
      const existing = await categoryQueries.findUnique({ slug: cat.slug });
      if (!existing) {
        await categoryQueries.create(cat);
        console.log(`✅ Category created: ${cat.name}`);
      }
    }

    // Create default store hours
    const days = [
      { dayOfWeek: 0, name: 'Sunday', isClosed: true },
      { dayOfWeek: 1, name: 'Monday', openTime: '11:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: 2, name: 'Tuesday', openTime: '11:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: 3, name: 'Wednesday', openTime: '11:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: 4, name: 'Thursday', openTime: '11:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: 5, name: 'Friday', openTime: '11:00', closeTime: '23:00', isClosed: false },
      { dayOfWeek: 6, name: 'Saturday', openTime: '11:00', closeTime: '23:00', isClosed: false },
    ];

    for (const day of days) {
      await storeHoursQueries.upsert({
        dayOfWeek: day.dayOfWeek,
        openTime: day.openTime,
        closeTime: day.closeTime,
        isClosed: day.isClosed
      });
      console.log(`✅ Store hours set for ${day.name}`);
    }

    // Create default home page content
    const homeContent = {
      hero: {
        title: "Authentic Pakistani Cuisine",
        subtitle: "Experience the flavors of Lahore and Karachi in Sudbury",
        ctaText: "View Menu",
        ctaLink: "/menu"
      },
      "why-choose-us": {
        title: "Why Choose Tandoori Tastes",
        items: [
          { title: "Authentic Recipes", description: "Traditional family recipes passed down through generations" },
          { title: "Fresh Ingredients", description: "We use only the freshest ingredients daily" },
          { title: "Halal Certified", description: "All our meat is halal certified" }
        ]
      }
    };

    await contentBlockQueries.upsert({
      page: 'home',
      section: 'hero',
      content: JSON.stringify(homeContent.hero),
      order: 0
    });

    await contentBlockQueries.upsert({
      page: 'home',
      section: 'why-choose-us',
      content: JSON.stringify(homeContent['why-choose-us']),
      order: 1
    });

    console.log('✅ Default content blocks created');

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log('✅ Seed script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });

