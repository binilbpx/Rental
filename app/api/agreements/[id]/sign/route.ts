import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { SignAgreementDto } from '@/types';
import { z } from 'zod';

const signSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  signature: z.string().optional(),
});

export async function POST(
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

    const body: SignAgreementDto = await request.json();
    const validation = signSchema.safeParse(body);
    
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

    const agreement = db.getAgreement(id);
    
    if (!agreement) {
      return NextResponse.json(
        {
          error: {
            code: 'AGREEMENT_NOT_FOUND',
            message: 'Agreement not found',
            statusCode: 404,
          },
        },
        { status: 404 }
      );
    }

    if (agreement.status === 'SIGNED') {
      return NextResponse.json(
        {
          error: {
            code: 'AGREEMENT_ALREADY_SIGNED',
            message: 'Agreement has already been signed',
            statusCode: 400,
          },
        },
        { status: 400 }
      );
    }

    // In a real implementation, this would:
    // 1. Generate PDF
    // 2. Upload to IPFS
    // 3. Call smart contract
    // For POC, we'll simulate with mock values
    
    const mockIpfsHash = `Qm${Math.random().toString(36).substring(2, 15)}`;
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;

    const updated = db.updateAgreement(id, {
      status: 'SIGNED',
      ipfsHash: mockIpfsHash,
      txHash: mockTxHash,
      signedAt: new Date(),
    });

    // Update user wallet address if not set
    const owner = db.getUser(agreement.ownerId);
    if (owner && !owner.walletAddress) {
      db.updateUser(agreement.ownerId, { walletAddress: validation.data.walletAddress });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to sign agreement',
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}

