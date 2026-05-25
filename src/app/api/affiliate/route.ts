import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DEMO_PRODUCTS } from '@/lib/constants';
import type { AffiliateResponse, AffiliateOffer, ApiErrorResponse } from '@/lib/api-types';

// ─── Zod Validation Schema ─────────────────────────────────
const affiliateQuerySchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

// ─── Helper: Generate mock affiliate offers ────────────────
function generateAffiliateOffers(productName: string): AffiliateOffer[] {
  // Generate 3 retailer offers with slight price variation
  const basePrice = 50 + Math.abs(hashString(productName)) % 500;

  return [
    {
      retailer: 'BigBasket',
      retailerLogo: '/retailers/bigbasket.svg',
      price: +(basePrice * 1.0).toFixed(2),
      currency: 'INR',
      url: `https://bigbasket.com/search?query=${encodeURIComponent(productName)}`,
      inStock: true,
      deliveryDays: 1,
    },
    {
      retailer: 'Blinkit',
      retailerLogo: '/retailers/blinkit.svg',
      price: +(basePrice * 1.05).toFixed(2),
      currency: 'INR',
      url: `https://blinkit.com/s/?q=${encodeURIComponent(productName)}`,
      inStock: true,
      deliveryDays: 0,
    },
    {
      retailer: 'JioMart',
      retailerLogo: '/retailers/jiomart.svg',
      price: +(basePrice * 0.95).toFixed(2),
      currency: 'INR',
      url: `https://jiomart.com/search/${encodeURIComponent(productName)}`,
      inStock: Math.random() > 0.2,
      deliveryDays: 2,
    },
  ];
}

// ─── Simple string hash for deterministic pricing ──────────
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// ─── GET /api/affiliate ────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const validation = affiliateQuerySchema.safeParse({
      productId: searchParams.get('productId') ?? '',
    });

    if (!validation.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        message: 'Invalid query parameters',
        errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { productId } = validation.data;

    // Find product name from demo data
    const found = DEMO_PRODUCTS.find((p) => p.barcode === productId);
    const productName = found?.name ?? `Product ${productId}`;

    const offers = generateAffiliateOffers(productName);

    const response: AffiliateResponse = {
      success: true,
      productId,
      productName,
      offers,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Affiliate API] Error:', error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: 'Internal server error while fetching affiliate offers',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
