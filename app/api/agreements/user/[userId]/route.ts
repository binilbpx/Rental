import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);
    
    if (isNaN(userId)) {
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

    const agreements = db.getAgreementsByUser(userId);
    
    return NextResponse.json({ agreements });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch agreements',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

