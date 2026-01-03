import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
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
            message: 'Invalid offer ID',
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    const offer = db.getOffer(id);
    
    if (!offer) {
      return NextResponse.json(
        {
          error: {
            code: 'OFFER_NOT_FOUND',
            message: 'Offer not found',
            statusCode: 404,
          },
        },
        { status: 404 }
      );
    }

    if (offer.status === 'ACCEPTED' || offer.status === 'REJECTED') {
      return NextResponse.json(
        {
          error: {
            code: 'OFFER_ALREADY_PROCESSED',
            message: 'Offer has already been processed',
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    db.updateOffer(id, { status: 'REJECTED' });
    
    return NextResponse.json(db.getOffer(id));
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to reject offer',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

