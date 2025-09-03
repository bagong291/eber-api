-- Migration: Add city field and instant_access form type
-- Description: Adds city field to form_submissions table and updates form_type enum to include instant_access

-- Add city column
ALTER TABLE form_submissions 
ADD COLUMN city VARCHAR(100) NULL COMMENT 'User city' 
AFTER company;

-- Update form_type enum to include instant_access
ALTER TABLE form_submissions 
MODIFY COLUMN form_type ENUM('inquiry', 'quote_request', 'contact', 'partnership', 'support', 'instant_access') 
NOT NULL DEFAULT 'contact' 
COMMENT 'Type of form submission';

-- Add index on city field for better search performance
CREATE INDEX idx_city ON form_submissions (city);