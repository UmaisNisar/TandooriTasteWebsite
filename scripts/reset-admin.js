const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetAdmin() {
  try {
    // Delete existing admin user if exists
    await prisma.user.deleteMany({
      where: {
        email: 'admin'
      }
    });

    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'admin',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${user.role}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();

