import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { LoginDto } from '@/types';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body: LoginDto = await request.json();
    
    const validation = loginSchema.safeParse(body);
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

    const user = db.getUserByEmail(validation.data.email);
    
    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
            statusCode: 401,
          },
        },
        { status: 401 }
      );
    }

    if (user.password !== validation.data.password) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
            statusCode: 401,
          },
        },
        { status: 401 }
      );
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to login',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

