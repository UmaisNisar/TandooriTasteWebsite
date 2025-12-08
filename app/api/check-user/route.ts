import { NextResponse } from 'next/server';
import { userQueries } from '@/lib/db-helpers';

export async function GET() {
  try {
    // Check if any users exist
    const users = await userQueries.findMany();
    
    // Check specifically for admin user
    const adminUser = await userQueries.findFirst({
      email: 'admin',
      role: 'ADMIN'
    });

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
    return NextResponse.json({
      error: String(error),
      message: 'Error checking users'
    }, { status: 500 });
  }
}

