-- ScanWise Supabase Database Schema
-- Run this in Supabase SQL Editor to set up the production database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users/Profiles ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'hi')),
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Products ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barcode TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  image_url TEXT,
  category TEXT,
  nutri_score TEXT CHECK (nutri_score IN ('A', 'B', 'C', 'D', 'E')),
  nova_group INTEGER CHECK (nova_group BETWEEN 1 AND 4),
  eco_score TEXT CHECK (eco_score IN ('A', 'B', 'C', 'D', 'E')),
  health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
  calories_per_100g DECIMAL(8,2),
  fat_per_100g DECIMAL(8,2),
  saturated_fat_per_100g DECIMAL(8,2),
  carbs_per_100g DECIMAL(8,2),
  sugar_per_100g DECIMAL(8,2),
  fiber_per_100g DECIMAL(8,2),
  protein_per_100g DECIMAL(8,2),
  salt_per_100g DECIMAL(8,2),
  sodium_per_100g DECIMAL(8,2),
  ingredients_text TEXT,
  allergens TEXT[],
  additives TEXT[],
  processing_level TEXT CHECK (processing_level IN ('minimally_processed', 'processed', 'ultra_processed')),
  ai_summary_en TEXT,
  ai_summary_hi TEXT,
  source TEXT DEFAULT 'open_food_facts',
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Favorites ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ─── Scan History ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scan_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  barcode TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Comparisons ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Affiliate Providers ───────────────────────────────────
CREATE TABLE IF NOT EXISTS affiliate_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  base_url TEXT NOT NULL,
  affiliate_tag TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Affiliate Offers ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS affiliate_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES affiliate_providers(id) ON DELETE CASCADE,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  url TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Affiliate Clicks ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES affiliate_providers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  ip_address TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Feature Flags ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AI Prompts ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  prompt TEXT NOT NULL,
  model TEXT DEFAULT 'gemini-pro',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Reports ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('product', 'user', 'scan', 'affiliate')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  reported_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Ingredients ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_hi TEXT,
  safety TEXT DEFAULT 'safe' CHECK (safety IN ('safe', 'caution', 'avoid')),
  category TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Allergen Info ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allergen_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  icon TEXT,
  severity TEXT DEFAULT 'moderate' CHECK (severity IN ('mild', 'moderate', 'severe')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_nutri_score ON products(nutri_score);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_user_id ON scan_history(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON scan_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product_id ON affiliate_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created_at ON affiliate_clicks(created_at DESC);

-- ─── RLS Policies ──────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Products are readable by everyone
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (true);
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can read own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can read own scan history" ON scan_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scan history" ON scan_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scan history" ON scan_history FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can read own comparisons" ON comparisons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own comparisons" ON comparisons FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Affiliate providers are publicly readable" ON affiliate_providers FOR SELECT USING (is_active = true);
CREATE POLICY "Affiliate offers are publicly readable" ON affiliate_offers FOR SELECT USING (in_stock = true);
CREATE POLICY "Anyone can track affiliate clicks" ON affiliate_clicks FOR INSERT WITH CHECK (true);

-- ─── Seed Data ─────────────────────────────────────────────
INSERT INTO products (barcode, name, brand, category, nutri_score, nova_group, eco_score, health_score, calories_per_100g, fat_per_100g, saturated_fat_per_100g, carbs_per_100g, sugar_per_100g, fiber_per_100g, protein_per_100g, salt_per_100g, sodium_per_100g, ingredients_text, allergens, additives, processing_level, ai_summary_en, ai_summary_hi, source, approved) VALUES
('8901234567890', 'Maggi 2-Minute Masala Noodles', 'Nestlé', 'Instant', 'D', 4, 'D', 25, 405, 16.8, 7.6, 55.5, 2.4, 2.2, 9.4, 2.5, 990, 'Wheat flour, palm oil, salt, mineral mix, masala mix', ARRAY['wheat', 'gluten'], ARRAY['E627', 'E631', 'E551'], 'ultra_processed', 'Maggi noodles are ultra-processed with high sodium and saturated fat.', 'मैगी नूडल्स अति-प्रसंस्कृत हैं।', 'open_food_facts', true),
('8901234567891', 'Amul Toned Milk', 'Amul', 'Dairy', 'A', 1, 'B', 88, 58, 3.0, 1.9, 4.8, 4.8, 0, 3.1, 0.1, 44, 'Toned milk', ARRAY['milk'], ARRAY[]::TEXT[], 'minimally_processed', 'Excellent nutritional value dairy product.', 'उत्कृष्ट पोषण मूल्य डेयरी उत्पाद।', 'open_food_facts', true);

INSERT INTO feature_flags (key, enabled, description) VALUES
('ai_summary', true, 'AI-powered health summary'),
('affiliate_links', true, 'Where to Buy affiliate links'),
('compare_mode', true, 'Product comparison feature'),
('dark_mode', true, 'Dark mode theme'),
('hindi_support', true, 'Hindi language support'),
('pwa_install', true, 'PWA install prompt');

INSERT INTO allergen_info (key, name_en, name_hi, icon, severity) VALUES
('milk', 'Milk', 'दूध', '🥛', 'severe'),
('eggs', 'Eggs', 'अंडे', '🥚', 'severe'),
('fish', 'Fish', 'मछली', '🐟', 'severe'),
('shellfish', 'Shellfish', 'शेलफिश', '🦐', 'severe'),
('tree_nuts', 'Tree Nuts', 'ट्री नट्स', '🥜', 'severe'),
('peanuts', 'Peanuts', 'मूंगफली', '🥜', 'severe'),
('wheat', 'Wheat', 'गेहूं', '🌾', 'moderate'),
('gluten', 'Gluten', 'ग्लूटेन', '🌾', 'moderate'),
('sesame', 'Sesame', 'तिल', '🫘', 'mild');
