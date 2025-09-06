-- Reset form submissions table for testing
-- This will clear all existing form submissions and reset the auto-increment

-- First, delete all existing records
DELETE FROM form_submissions;

-- Reset the auto-increment counter
ALTER TABLE form_submissions AUTO_INCREMENT = 1;

-- Show the table structure to verify the status enum has been updated
DESCRIBE form_submissions;

-- Show that the table is now empty
SELECT COUNT(*) as total_submissions FROM form_submissions;