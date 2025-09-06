-- Migration: Add product_code column to form_submissions table
-- This migration adds support for tracking product codes in product email submissions

-- Add the product_code column
ALTER TABLE form_submissions 
ADD COLUMN product_code VARCHAR(100) NULL;

-- Create index for product_code for better query performance
CREATE INDEX idx_form_submissions_product_code ON form_submissions(product_code);

-- Update existing product_email type submissions to extract product code from message if possible
UPDATE form_submissions 
SET product_code = CASE 
    WHEN form_type = 'product_email' AND message LIKE '%product code:%' THEN 
        TRIM(SUBSTRING(message FROM 'product code: ([^.]+)'))
    ELSE NULL
END
WHERE form_type = 'product_email' AND product_code IS NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN form_submissions.product_code IS 'Product code for product email submissions';