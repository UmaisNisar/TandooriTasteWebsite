import { NextResponse } from 'next/server';
import { userQueries } from '@/lib/db-helpers';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // Delete existing admin user if exists
    await userQueries.deleteMany({ email: 'admin' });

    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await userQueries.create({
      email: 'admin',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user reset successfully!',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      credentials: {
        email: 'admin',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Reset admin error:', error);
    return NextResponse.json({
      error: String(error),
      message: 'Error resetting admin user'
    }, { status: 500 });
  }
}

