import { NextResponse } from 'next/server';
import { userQueries } from '@/lib/db-helpers';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Find the admin user
    const adminUser = await userQueries.findFirst({
      email: 'admin',
      role: 'ADMIN'
    });

    if (!adminUser) {
      return NextResponse.json({
        error: 'Admin user not found'
      }, { status: 404 });
    }

    // Test password comparison
    const testPassword = 'admin123';
    const passwordMatch = await bcrypt.compare(testPassword, adminUser.password);

    return NextResponse.json({
      userExists: true,
      email: adminUser.email,
      role: adminUser.role,
      passwordHashLength: adminUser.password.length,
      passwordHashPreview: adminUser.password.substring(0, 20) + '...',
      passwordMatch: passwordMatch,
      message: passwordMatch 
        ? '✅ Password matches! Login should work.' 
        : '❌ Password does NOT match! Need to reset admin user.'
    });
  } catch (error) {
    console.error('Test password error:', error);
    return NextResponse.json({
      error: String(error)
    }, { status: 500 });
  }
}


