import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { ownerId: string } }
) {
  try {
    const ownerId = parseInt(params.ownerId);
    
    if (isNaN(ownerId)) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_ID',
            message: 'Invalid owner ID',
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    const properties = db.getAllProperties({ ownerId });
    
    return NextResponse.json({ properties });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch properties',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

