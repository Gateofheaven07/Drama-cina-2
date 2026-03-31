import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Email, password, dan nama wajib diisi' },
        { status: 400 }
      );
    }

    // Normalisasi email: pastikan semua lowercase sebelum operasi DB
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email ini sudah terdaftar' },
        { status: 409 }
      );
    }

    // Hash password untuk keamanan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in internal database
    console.log(`[Register] Creating user: ${normalizedEmail}`);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name,
        password: hashedPassword,
      },
    });
    console.log(`[Register] User created successfully: ${user.id}`);

    return NextResponse.json(
      { 
        message: 'User berhasil didaftarkan', 
        user: { id: user.id, email: user.email, name: user.name } 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Terjadi kesalahan registrasi:', error);
    
    // Memberikan pesan error lebih spesifik jika memungkinkan
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Email ini sudah terdaftar (P2002)' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: `Gagal mendaftarkan user: ${error.message || 'Server error'}` },
      { status: 500 }
    );
  }
}
