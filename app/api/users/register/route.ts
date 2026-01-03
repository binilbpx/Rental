import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { CreateUserDto } from '@/types';
import { z } from 'zod';

const registerSchema = z.object({
  role: z.enum(['owner', 'tenant']),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserDto = await request.json();
    
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error.errors[0].message,
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = db.getUserByEmail(validation.data.email);
    if (existingUser) {
      return NextResponse.json(
        {
          error: {
            code: 'EMAIL_EXISTS',
            message: 'Email already registered',
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    const user = db.createUser({
      role: validation.data.role,
      name: validation.data.name,
      email: validation.data.email,
      password: validation.data.password,
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to register user',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

