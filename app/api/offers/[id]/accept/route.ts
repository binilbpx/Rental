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

    if (offer.status !== 'PENDING' && offer.status !== 'COUNTERED') {
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

    // Update offer status
    db.updateOffer(id, { status: 'ACCEPTED' });

    // Get property and update status
    const property = db.getProperty(offer.propertyId);
    if (property) {
      db.updateProperty(offer.propertyId, { status: 'AGREED' });
    }

    // Create agreement
    const agreement = db.createAgreement({
      propertyId: offer.propertyId,
      ownerId: property?.ownerId || 0,
      tenantId: offer.tenantId,
      finalAmount: offer.amount,
    });

    return NextResponse.json({
      offer: db.getOffer(id),
      agreement,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to accept offer',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

