import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DEMO_PRODUCTS } from '@/lib/constants';
import type { ScanResponse, ProductResponse, ApiErrorResponse } from '@/lib/api-types';

// ─── Zod Validation Schema ─────────────────────────────────
const scanSchema = z.object({
  barcode: z
    .string()
    .min(1, 'Barcode is required')
    .max(50, 'Barcode too long')
    .regex(/^[\dA-Za-z\-_]+$/, 'Invalid barcode format'),
});

// ─── Helper: generate mock product for unknown barcodes ────
function generateMockProduct(barcode: string): ProductResponse {
  return {
    id: barcode,
    barcode,
    name: `Unknown Product (${barcode})`,
    brand: 'Unknown Brand',
    image_url: '/demo/unknown.png',
    category: 'Unknown',
    nutri_score: 'C',
    nova_group: 3,
    eco_score: 'C',
    health_score: 50,
    calories_per_100g: 250,
    fat_per_100g: 10,
    saturated_fat_per_100g: 3,
    carbs_per_100g: 35,
    sugar_per_100g: 8,
    fiber_per_100g: 2,
    protein_per_100g: 5,
    salt_per_100g: 0.8,
    sodium_per_100g: 320,
    ingredients_text: 'Ingredients not available for this product.',
    allergens: [],
    additives: [],
    processing_level: 'processed',
    ai_summary_en:
      'This product was not found in our database. The nutrition information shown is estimated and may not be accurate. Please verify with the product packaging.',
    ai_summary_hi:
      'यह उत्पाद हमारे डेटाबेस में नहीं मिला। दिखाई गई पोषण जानकारी अनुमानित है और सटीक नहीं हो सकती। कृपया उत्पाद पैकेजिंग से सत्यापित करें।',
  };
}

// ─── POST /api/scan ────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = scanSchema.safeParse(body);
    if (!validation.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        message: 'Invalid input',
        errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { barcode } = validation.data;

    // Look up product in demo data
    const found = DEMO_PRODUCTS.find((p) => p.barcode === barcode);

    let product: ProductResponse;

    if (found) {
      product = {
        id: found.barcode,
        barcode: found.barcode,
        name: found.name,
        brand: found.brand,
        image_url: found.image_url,
        category: found.category,
        nutri_score: found.nutri_score,
        nova_group: found.nova_group,
        eco_score: found.eco_score,
        health_score: found.health_score,
        calories_per_100g: found.calories_per_100g,
        fat_per_100g: found.fat_per_100g,
        saturated_fat_per_100g: found.saturated_fat_per_100g,
        carbs_per_100g: found.carbs_per_100g,
        sugar_per_100g: found.sugar_per_100g,
        fiber_per_100g: found.fiber_per_100g,
        protein_per_100g: found.protein_per_100g,
        salt_per_100g: found.salt_per_100g,
        sodium_per_100g: found.sodium_per_100g,
        ingredients_text: found.ingredients_text,
        allergens: found.allergens,
        additives: found.additives,
        processing_level: found.processing_level,
        ai_summary_en: found.ai_summary_en,
        ai_summary_hi: found.ai_summary_hi,
      };
    } else {
      product = generateMockProduct(barcode);
    }

    const response: ScanResponse = {
      success: true,
      product,
      message: found ? 'Product found' : 'Product not found in database, showing estimated data',
    };

    return NextResponse.json(response, { status: found ? 200 : 200 });
  } catch (error) {
    console.error('[Scan API] Error:', error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: 'Internal server error while scanning product',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
