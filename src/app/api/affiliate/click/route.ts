import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { AffiliateClickResponse, ApiErrorResponse } from '@/lib/api-types';

// ─── Zod Validation Schema ─────────────────────────────────
const affiliateClickSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  retailer: z.string().min(1, 'Retailer name is required'),
  url: z.string().url('Must be a valid URL'),
});

// ─── In-memory click tracking (demo only) ─────────────────
const clickLog: Array<{
  productId: string;
  retailer: string;
  url: string;
  timestamp: string;
  ip: string;
}> = [];

// ─── POST /api/affiliate/click ─────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = affiliateClickSchema.safeParse(body);
    if (!validation.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        message: 'Invalid input',
        errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { productId, retailer, url } = validation.data;

    // Log the click (in production, this would go to a database)
    const clickEntry = {
      productId,
      retailer,
      url,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') ?? 'unknown',
    };
    clickLog.push(clickEntry);

    console.log(
      `[Affiliate Click] Product: ${productId}, Retailer: ${retailer}, Total clicks: ${clickLog.length}`
    );

    const response: AffiliateClickResponse = {
      success: true,
      redirectUrl: url,
      tracked: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Affiliate Click API] Error:', error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: 'Internal server error while tracking affiliate click',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
