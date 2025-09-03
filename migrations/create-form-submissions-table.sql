-- Migration: Create form_submissions table
-- Description: Creates the table for storing contact form submissions

CREATE TABLE IF NOT EXISTS form_submissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL COMMENT 'User first name',
    last_name VARCHAR(100) NOT NULL COMMENT 'User last name',
    email VARCHAR(255) NOT NULL COMMENT 'User email address',
    phone VARCHAR(20) NULL COMMENT 'User phone number',
    company VARCHAR(200) NULL COMMENT 'User company name',
    subject VARCHAR(200) NOT NULL COMMENT 'Form subject',
    message TEXT NOT NULL COMMENT 'Form message content',
    form_type ENUM('inquiry', 'quote_request', 'contact', 'partnership', 'support') NOT NULL DEFAULT 'contact' COMMENT 'Type of form submission',
    status ENUM('pending', 'responded', 'resolved', 'spam') NOT NULL DEFAULT 'pending' COMMENT 'Submission status',
    email_sent BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Whether email notification was sent',
    email_sent_at DATETIME NULL COMMENT 'When email was sent',
    ip_address VARCHAR(45) NULL COMMENT 'User IP address',
    user_agent TEXT NULL COMMENT 'User browser information',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record update timestamp',
    
    INDEX idx_email (email),
    INDEX idx_form_type (form_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Contact form submissions';