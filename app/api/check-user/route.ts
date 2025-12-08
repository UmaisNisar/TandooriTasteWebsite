import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check if any users exist
    const users = await prisma.user.findMany();
    
    // Check specifically for admin user
    const adminUser = await prisma.user.findFirst({
      where: {
        email: 'admin',
        role: 'ADMIN'
      }
    });

    await prisma.$disconnect();

    return NextResponse.json({
      totalUsers: users.length,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        role: u.role,
        name: u.name
      })),
      adminUser: adminUser ? {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name
      } : null,
      message: adminUser ? 'Admin user exists' : 'No admin user found'
    });
  } catch (error) {
    console.error('Check user error:', error);
    await prisma.$disconnect();
    return NextResponse.json({
      error: String(error),
      message: 'Error checking users'
    }, { status: 500 });
  }
}

