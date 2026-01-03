import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_ID',
            message: 'Invalid user ID',
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    const user = db.getUser(id);
    
    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: 'USER_NOT_FOUND',
            message: `User with ID ${id} not found`,
            statusCode: 404,
          },
        },
        { status: 404 }
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
          message: 'Failed to fetch user',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

