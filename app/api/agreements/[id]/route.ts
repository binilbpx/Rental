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
            message: 'Invalid agreement ID',
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    const agreement = db.getAgreement(id);
    
    if (!agreement) {
      return NextResponse.json(
        {
          error: {
            code: 'AGREEMENT_NOT_FOUND',
            message: `Agreement with ID ${id} not found`,
            statusCode: 404,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(agreement);
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch agreement',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

