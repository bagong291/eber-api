-- Migration: Add multi-language support to products table
-- Date: 2024-01-XX

-- Add multi-language columns for product name and performance features
ALTER TABLE products 
ADD COLUMN name_en VARCHAR(255),
ADD COLUMN name_id VARCHAR(255),
ADD COLUMN performance_feature_en TEXT,
ADD COLUMN performance_feature_id TEXT;

-- Update existing records with default values (copy from existing fields if they exist)
-- Assuming existing data might be in English, we'll copy to English fields
UPDATE products 
SET name_en = COALESCE(code, ''),
    name_id = COALESCE(code, ''),
    performance_feature_en = COALESCE(performance_feature, ''),
    performance_feature_id = COALESCE(performance_feature, '')
WHERE name_en IS NULL OR name_id IS NULL OR performance_feature_en IS NULL OR performance_feature_id IS NULL;

-- Note: After migration, make sure to update your application to populate these fields properly
-- The legacy 'performance_feature' column is kept for backward compatibility but will be deprecated