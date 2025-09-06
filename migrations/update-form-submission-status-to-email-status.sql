-- Migration: Update form_submissions status to email delivery status
-- Description: Changes status from workflow-based to email delivery status (sent/failed)

-- First, update existing records to map old status to new email-based status
-- pending -> failed (assuming pending means email wasn't sent yet)
-- responded/resolved -> sent (assuming these mean email was successfully sent)
-- spam -> failed (spam submissions typically don't get email responses)

UPDATE form_submissions 
SET status = CASE 
    WHEN email_sent = TRUE THEN 'sent'
    ELSE 'failed'
END;

-- Now alter the table to change the ENUM values
ALTER TABLE form_submissions 
MODIFY COLUMN status ENUM('sent', 'failed') NOT NULL DEFAULT 'failed' 
COMMENT 'Email delivery status - sent or failed to send';

-- Update the comment for the table to reflect the new purpose
ALTER TABLE form_submissions 
COMMENT = 'Contact form submissions with email delivery tracking';