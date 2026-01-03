import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const tenantId = parseInt(params.tenantId);
    
    if (isNaN(tenantId)) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_ID',
            message: 'Invalid tenant ID',
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    const offers = db.getOffersByTenant(tenantId);
    
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

