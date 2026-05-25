import { NextRequest, NextResponse } from 'next/server';
import { DEMO_PRODUCTS } from '@/lib/constants';
import type { ProductDetailResponse, ProductResponse, ApiErrorResponse } from '@/lib/api-types';

// ─── GET /api/products/[id] ────────────────────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Look up by id (which equals barcode in our demo data)
    const found = DEMO_PRODUCTS.find((p) => p.barcode === id);

    if (!found) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        message: `Product with id "${id}" not found`,
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const product: ProductResponse = {
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

    const response: ProductDetailResponse = {
      success: true,
      product,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Product Detail API] Error:', error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: 'Internal server error while fetching product details',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
