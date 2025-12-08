import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    console.log("[TEST-AUTH] Testing with email:", email);
    
    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password required'
      }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    console.log("[TEST-AUTH] Normalized email:", normalizedEmail);
    
    const user = await prisma.user.findUnique({ 
      where: { email: normalizedEmail } 
    });
    
    console.log("[TEST-AUTH] User found:", user ? {
      id: user.id,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password
    } : "null");

    if (!user) {
      await prisma.$disconnect();
      return NextResponse.json({
        step: 'user_lookup',
        success: false,
        error: 'User not found'
      });
    }

    if (user.role !== "ADMIN") {
      await prisma.$disconnect();
      return NextResponse.json({
        step: 'role_check',
        success: false,
        error: `User role is ${user.role}, expected ADMIN`
      });
    }

    console.log("[TEST-AUTH] Comparing password...");
    const valid = await bcrypt.compare(password, user.password);
    console.log("[TEST-AUTH] Password match:", valid);

    await prisma.$disconnect();

    if (!valid) {
      return NextResponse.json({
        step: 'password_check',
        success: false,
        error: 'Password does not match'
      });
    }

    return NextResponse.json({
      step: 'all_checks',
      success: true,
      message: 'All authentication checks passed!',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("[TEST-AUTH] Error:", error);
    await prisma.$disconnect();
    return NextResponse.json({
      error: String(error),
      message: 'Error during authentication test'
    }, { status: 500 });
  }
}


