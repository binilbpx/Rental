import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const propertyId = parseInt(params.propertyId);
    
    if (isNaN(propertyId)) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_ID',
            message: 'Invalid property ID',
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    const offers = db.getOffersByProperty(propertyId);
    
    return NextResponse.json({ offers });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch offers',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

