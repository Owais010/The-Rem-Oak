-- ============================================
-- THE REM OAK — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Locations table
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category TEXT NOT NULL,
  genre TEXT[] DEFAULT '{}',
  group_type TEXT[] DEFAULT '{}',
  latitude FLOAT8,
  longitude FLOAT8,
  district TEXT,
  image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  rating FLOAT4 DEFAULT 0,
  review_count INT4 DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  best_time TEXT,
  entry_fee TEXT,
  nearby_transport TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id TEXT, -- Removed FK constraint to avoid 409 conflicts if locations are not seeded
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT,
  rating INT2 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Locations: Everyone can read
CREATE POLICY "Locations are viewable by everyone"
  ON locations FOR SELECT
  USING (true);

-- Reviews: Everyone can read, only authenticated users can insert
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- User profiles: Anyone can read, users can update own
CREATE POLICY "Profiles are viewable by everyone"
  ON user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- 6. Setup storage bucket and policies for review images
INSERT INTO storage.buckets (id, name, public) VALUES ('review-images', 'review-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Access on review-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-images');

CREATE POLICY "Authenticated users upload to review-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'review-images' AND auth.role() = 'authenticated');

-- 7. Enable Text Search (optional, for better search)
CREATE INDEX IF NOT EXISTS idx_locations_name ON locations USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_locations_district ON locations USING GIN (to_tsvector('english', district));
CREATE INDEX IF NOT EXISTS idx_locations_category ON locations (category);
CREATE INDEX IF NOT EXISTS idx_reviews_location ON reviews (location_id);
