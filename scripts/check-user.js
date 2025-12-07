const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- Email: ${user.email}, Role: ${user.role}, Name: ${user.name}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();

