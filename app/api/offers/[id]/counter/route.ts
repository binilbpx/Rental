import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { CounterOfferDto } from '@/types';
import { z } from 'zod';

const counterSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  message: z.string().optional(),
});

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

    const body: CounterOfferDto = await request.json();
    const validation = counterSchema.safeParse(body);
    
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

    const previousOffer = db.getOffer(id);
    
    if (!previousOffer) {
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

    if (previousOffer.status === 'ACCEPTED' || previousOffer.status === 'REJECTED') {
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

    // Update previous offer
    db.updateOffer(id, { status: 'COUNTERED' });

    // Create new counter-offer
    const newOffer = db.createOffer({
      propertyId: previousOffer.propertyId,
      tenantId: previousOffer.tenantId,
      amount: validation.data.amount,
      message: validation.data.message,
      previousOfferId: id,
    });

    return NextResponse.json({
      newOffer,
      previousOffer: db.getOffer(id),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to counter offer',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

