// ─── Shared API Types for ScanWise ─────────────────────────

// ─── Product Types ─────────────────────────────────────────
export interface ProductResponse {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  image_url: string;
  category: string;
  nutri_score: 'A' | 'B' | 'C' | 'D' | 'E';
  nova_group: 1 | 2 | 3 | 4;
  eco_score: 'A' | 'B' | 'C' | 'D' | 'E';
  health_score: number;
  calories_per_100g: number;
  fat_per_100g: number;
  saturated_fat_per_100g: number;
  carbs_per_100g: number;
  sugar_per_100g: number;
  fiber_per_100g: number;
  protein_per_100g: number;
  salt_per_100g: number;
  sodium_per_100g: number;
  ingredients_text: string;
  allergens: string[];
  additives: string[];
  processing_level: 'minimally_processed' | 'processed' | 'ultra_processed';
  ai_summary_en: string;
  ai_summary_hi: string;
}

export interface ProductCardData {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  image_url: string;
  category: string;
  nutri_score: ProductResponse['nutri_score'];
  nova_group: ProductResponse['nova_group'];
  eco_score: ProductResponse['eco_score'];
  health_score: number;
  calories_per_100g: number;
}

// ─── Scan Types ────────────────────────────────────────────
export interface ScanRequest {
  barcode: string;
}

export interface ScanResponse {
  success: boolean;
  product: ProductResponse | null;
  message: string;
}

// ─── Products List Types ───────────────────────────────────
export interface ProductsListResponse {
  success: boolean;
  products: ProductCardData[];
  total: number;
  limit: number;
  offset: number;
}

export interface ProductDetailResponse {
  success: boolean;
  product: ProductResponse | null;
  message?: string;
}

// ─── AI Summary Types ──────────────────────────────────────
export interface AISummaryRequest {
  productName: string;
  ingredients: string;
  allergens: string[];
  locale: 'en' | 'hi';
}

export interface AISummaryResponse {
  success: boolean;
  summaryEn: string;
  summaryHi: string;
  source: 'ai' | 'fallback';
}

// ─── Affiliate Types ───────────────────────────────────────
export interface AffiliateOffer {
  retailer: string;
  retailerLogo: string;
  price: number;
  currency: string;
  url: string;
  inStock: boolean;
  deliveryDays: number;
}

export interface AffiliateResponse {
  success: boolean;
  productId: string;
  productName: string;
  offers: AffiliateOffer[];
}

export interface AffiliateClickRequest {
  productId: string;
  retailer: string;
  url: string;
}

export interface AffiliateClickResponse {
  success: boolean;
  redirectUrl: string;
  tracked: boolean;
}

// ─── Auth Types ────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user: AuthUser | null;
  token: string | null;
  message: string;
}

// ─── Error Response ────────────────────────────────────────
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
