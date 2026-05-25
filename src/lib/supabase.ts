import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          language: 'en' | 'hi';
          theme: 'light' | 'dark' | 'system';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          language?: 'en' | 'hi';
          theme?: 'light' | 'dark' | 'system';
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          language?: 'en' | 'hi';
          theme?: 'light' | 'dark' | 'system';
        };
      };
      products: {
        Row: {
          id: string;
          barcode: string;
          name: string;
          brand: string | null;
          image_url: string | null;
          category: string | null;
          nutri_score: 'A' | 'B' | 'C' | 'D' | 'E' | null;
          nova_group: 1 | 2 | 3 | 4 | null;
          eco_score: 'A' | 'B' | 'C' | 'D' | 'E' | null;
          health_score: number | null;
          calories_per_100g: number | null;
          fat_per_100g: number | null;
          saturated_fat_per_100g: number | null;
          carbs_per_100g: number | null;
          sugar_per_100g: number | null;
          fiber_per_100g: number | null;
          protein_per_100g: number | null;
          salt_per_100g: number | null;
          sodium_per_100g: number | null;
          ingredients_text: string | null;
          allergens: string[] | null;
          additives: string[] | null;
          processing_level: 'minimally_processed' | 'processed' | 'ultra_processed' | null;
          ai_summary_en: string | null;
          ai_summary_hi: string | null;
          source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barcode: string;
          name: string;
          brand?: string | null;
          image_url?: string | null;
          category?: string | null;
          nutri_score?: 'A' | 'B' | 'C' | 'D' | 'E' | null;
          nova_group?: 1 | 2 | 3 | 4 | null;
          eco_score?: 'A' | 'B' | 'C' | 'D' | 'E' | null;
          health_score?: number | null;
          calories_per_100g?: number | null;
          fat_per_100g?: number | null;
          saturated_fat_per_100g?: number | null;
          carbs_per_100g?: number | null;
          sugar_per_100g?: number | null;
          fiber_per_100g?: number | null;
          protein_per_100g?: number | null;
          salt_per_100g?: number | null;
          sodium_per_100g?: number | null;
          ingredients_text?: string | null;
          allergens?: string[] | null;
          additives?: string[] | null;
          processing_level?: 'minimally_processed' | 'processed' | 'ultra_processed' | null;
          ai_summary_en?: string | null;
          ai_summary_hi?: string | null;
          source?: string | null;
        };
        Update: {
          name?: string;
          brand?: string | null;
          image_url?: string | null;
          category?: string | null;
          nutri_score?: 'A' | 'B' | 'C' | 'D' | 'E' | null;
          nova_group?: 1 | 2 | 3 | 4 | null;
          eco_score?: 'A' | 'B' | 'C' | 'D' | 'E' | null;
          health_score?: number | null;
          [key: string]: unknown;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
        };
      };
      scan_history: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          barcode: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
          barcode: string;
        };
      };
      comparisons: {
        Row: {
          id: string;
          user_id: string;
          product_ids: string[];
          created_at: string;
        };
        Insert: {
          user_id: string;
          product_ids: string[];
        };
      };
      affiliate_providers: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          base_url: string;
          affiliate_tag: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          base_url: string;
          logo_url?: string | null;
          affiliate_tag?: string | null;
          is_active?: boolean;
        };
      };
      affiliate_offers: {
        Row: {
          id: string;
          product_id: string;
          provider_id: string;
          price: number | null;
          currency: string;
          url: string;
          in_stock: boolean;
          last_checked: string;
          created_at: string;
        };
        Insert: {
          product_id: string;
          provider_id: string;
          price?: number | null;
          currency?: string;
          url: string;
          in_stock?: boolean;
        };
      };
      feature_flags: {
        Row: {
          id: string;
          key: string;
          enabled: boolean;
          description: string | null;
          created_at: string;
        };
        Insert: {
          key: string;
          enabled: boolean;
          description?: string | null;
        };
      };
    };
  };
};
