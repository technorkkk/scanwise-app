import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DEMO_PRODUCTS } from '@/lib/constants';
import type {
  ProductsListResponse,
  ProductCardData,
  ApiErrorResponse,
} from '@/lib/api-types';

// ─── Zod Validation Schema ─────────────────────────────────
const productsQuerySchema = z.object({
  search: z.string().optional().default(''),
  category: z.string().optional().default(''),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

// ─── GET /api/products ─────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query params
    const validation = productsQuerySchema.safeParse({
      search: searchParams.get('search') ?? '',
      category: searchParams.get('category') ?? '',
      limit: searchParams.get('limit') ?? '20',
      offset: searchParams.get('offset') ?? '0',
    });

    if (!validation.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        message: 'Invalid query parameters',
        errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { search, category, limit, offset } = validation.data;

    // Filter products
    let filtered = DEMO_PRODUCTS;

    // Search by name, brand, or category
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Filter by exact category match
    if (category) {
      const cat = category.toLowerCase();
      filtered = filtered.filter((p) => p.category.toLowerCase() === cat);
    }

    // Map to card data
    const allCards: ProductCardData[] = filtered.map((p) => ({
      id: p.barcode,
      barcode: p.barcode,
      name: p.name,
      brand: p.brand,
      image_url: p.image_url,
      category: p.category,
      nutri_score: p.nutri_score,
      nova_group: p.nova_group,
      eco_score: p.eco_score,
      health_score: p.health_score,
      calories_per_100g: p.calories_per_100g,
    }));

    // Paginate
    const total = allCards.length;
    const paginated = allCards.slice(offset, offset + limit);

    const response: ProductsListResponse = {
      success: true,
      products: paginated,
      total,
      limit,
      offset,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Products API] Error:', error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: 'Internal server error while fetching products',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
