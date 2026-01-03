import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { CreatePropertyDto } from '@/types';
import { z } from 'zod';

const propertySchema = z.object({
  ownerId: z.number().int().positive(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  videoUrl: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  location: z.string().optional(),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ownerId = searchParams.get('ownerId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const filters: any = { status: 'OPEN' };
    if (ownerId) filters.ownerId = parseInt(ownerId);
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

    const properties = db.getAllProperties(filters);
    
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

export async function POST(request: NextRequest) {
  try {
    const body: CreatePropertyDto = await request.json();
    
    const validation = propertySchema.safeParse(body);
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

    // Verify owner exists
    const owner = db.getUser(validation.data.ownerId);
    if (!owner || owner.role !== 'owner') {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_OWNER',
            message: 'Owner not found or invalid',
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    const property = db.createProperty(validation.data);
    
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create property',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

