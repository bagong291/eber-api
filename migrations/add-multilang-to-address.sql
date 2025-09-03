-- Migration: Add multilingual address fields to company_profiles table
-- This migration adds address_en and address_id fields while keeping the original address field for backward compatibility

-- Add the new multilingual address columns
ALTER TABLE company_profiles 
ADD COLUMN address_en VARCHAR(255),
ADD COLUMN address_id VARCHAR(255);

-- Update existing records to populate the new fields with the current address value
UPDATE company_profiles 
SET address_en = address, 
    address_id = address 
WHERE address_en IS NULL OR address_id IS NULL;

-- Make the new fields required (NOT NULL)
ALTER TABLE company_profiles 
ALTER COLUMN address_en SET NOT NULL,
ALTER COLUMN address_id SET NOT NULL;

-- Make the original address field nullable for backward compatibility
ALTER TABLE company_profiles 
ALTER COLUMN address DROP NOT NULL;

-- Remove the unique constraint from the original address field as it's no longer the primary address field
ALTER TABLE company_profiles 
DROP CONSTRAINT IF EXISTS company_profiles_address_key;

-- Note: No new unique constraints are added to the multilingual fields to allow for duplicate addresses in different languages