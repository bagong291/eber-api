-- Migration: Add product_email enum value to form_type if it doesn't exist
-- This ensures the enum includes the product_email value needed for the API

-- Check if the enum value exists and add it if it doesn't
DO $$
BEGIN
    -- Try to add the new enum value
    BEGIN
        ALTER TYPE enum_form_submissions_form_type ADD VALUE 'product_email';
    EXCEPTION 
        WHEN duplicate_object THEN
            -- Value already exists, do nothing
            NULL;
    END;
END$$;

-- Verify the enum now includes product_email
-- You can check with: SELECT unnest(enum_range(NULL::enum_form_submissions_form_type));