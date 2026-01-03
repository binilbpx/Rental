import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { CreateOfferDto } from '@/types';
import { z } from 'zod';

const offerSchema = z.object({
  propertyId: z.number().int().positive(),
  tenantId: z.number().int().positive(),
  amount: z.number().positive('Amount must be positive'),
  message: z.string().optional(),
  previousOfferId: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body: CreateOfferDto = await request.json();
    
    const validation = offerSchema.safeParse(body);
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

    // Verify property exists and is OPEN
    const property = db.getProperty(validation.data.propertyId);
    if (!property) {
      return NextResponse.json(
        {
          error: {
            code: 'PROPERTY_NOT_FOUND',
            message: 'Property not found',
            statusCode: 404,
          },
        },
        { status: 404 }
      );
    }

    if (property.status !== 'OPEN') {
      return NextResponse.json(
        {
          error: {
            code: 'PROPERTY_ALREADY_AGREED',
            message: 'Property is no longer available',
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    // Verify tenant exists
    const tenant = db.getUser(validation.data.tenantId);
    if (!tenant || tenant.role !== 'tenant') {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_TENANT',
            message: 'Tenant not found or invalid',
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    // If this is a counter-offer, update previous offer status
    if (validation.data.previousOfferId) {
      const previousOffer = db.getOffer(validation.data.previousOfferId);
      if (previousOffer) {
        db.updateOffer(validation.data.previousOfferId, { status: 'COUNTERED' });
      }
    }

    const offer = db.createOffer(validation.data);
    
    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create offer',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

