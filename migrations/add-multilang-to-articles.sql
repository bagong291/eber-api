-- Migration: Add multi-language support to articles table
-- Run this SQL to add the new multi-language fields

-- Add new multi-language columns
ALTER TABLE articles 
ADD COLUMN title_en VARCHAR(255),
ADD COLUMN title_id VARCHAR(255),
ADD COLUMN body_en TEXT,
ADD COLUMN body_id TEXT;

-- Migrate existing data to new fields (copy current title/body to both languages)
UPDATE articles 
SET 
    title_en = COALESCE(title, ''),
    title_id = COALESCE(title, ''),
    body_en = COALESCE(body, ''),
    body_id = COALESCE(body, '')
WHERE title_en IS NULL OR title_id IS NULL OR body_en IS NULL OR body_id IS NULL;

-- Make the new fields NOT NULL after data migration
ALTER TABLE articles 
ALTER COLUMN title_en SET NOT NULL,
ALTER COLUMN title_id SET NOT NULL,
ALTER COLUMN body_en SET NOT NULL,
ALTER COLUMN body_id SET NOT NULL;

-- Optional: Make legacy fields nullable (for backward compatibility)
ALTER TABLE articles 
ALTER COLUMN title DROP NOT NULL,
ALTER COLUMN body DROP NOT NULL;

-- Add indexes for better performance
CREATE INDEX idx_articles_title_en ON articles(title_en);
CREATE INDEX idx_articles_title_id ON articles(title_id);
