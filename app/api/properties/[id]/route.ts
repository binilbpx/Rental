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
            message: 'Invalid property ID',
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    const property = db.getProperty(id);
    
    if (!property) {
      return NextResponse.json(
        {
          error: {
            code: 'PROPERTY_NOT_FOUND',
            message: `Property with ID ${id} not found`,
            statusCode: 404,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch property',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

