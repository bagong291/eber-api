# Form Submission API

This feature provides a complete form submission system with email notifications and admin management capabilities.

## Features

- **Public Form Submission**: Submit forms with validation
- **Email Notifications**: Automatic email notifications to admin and user
- **Admin Management**: Full CRUD operations for form submissions
- **Statistics Dashboard**: Get statistics about form submissions
- **Email Management**: Resend emails and send custom responses
- **Product Link Integration**: Auto-include product list links in emails

## API Endpoints

### Public Endpoints
- `POST /api/v1/form-submissions` - Submit a form

### Admin Endpoints (Require Authentication)
- `GET /api/v1/form-submissions/admin` - List all submissions with filtering
- `GET /api/v1/form-submissions/admin/statistics` - Get submission statistics
- `GET /api/v1/form-submissions/admin/{id}` - Get specific submission
- `PUT /api/v1/form-submissions/admin/{id}/status` - Update submission status
- `POST /api/v1/form-submissions/admin/{id}/resend-email` - Resend auto-response
- `POST /api/v1/form-submissions/admin/{id}/send-response` - Send custom response
- `DELETE /api/v1/form-submissions/admin/{id}` - Delete submission
- `GET /api/v1/form-submissions/admin/email-service/check` - Check email service status

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```bash
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com          # Your SMTP server
SMTP_PORT=587                     # SMTP port (587 for TLS, 465 for SSL)
SMTP_SECURE=false                 # true for SSL (port 465), false for TLS (port 587)
SMTP_USER=your_email@gmail.com    # Your email address
SMTP_PASS=your_app_password       # Your email password or app password

# Company Information
COMPANY_NAME=Your Company Name    # Company name for email templates
ADMIN_EMAIL=admin@yourcompany.com # Admin email to receive notifications
WEBSITE_URL=https://yourcompany.com # Your website URL for product links
```

### 2. Gmail Setup (if using Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `SMTP_PASS`

### 3. Database Migration

The FormSubmission model will be automatically created when the server starts due to `sequelize.sync({ alter: true })` in app.js.

### 4. Testing

Start the server and visit `/api-docs` to see the Swagger documentation and test the endpoints.

## Form Submission Structure

```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "company": "Acme Corporation",
  "subject": "Product inquiry",
  "message": "I would like to know more about your products.",
  "formType": "inquiry"
}
```

### Form Types
- `inquiry` - General inquiries (default)
- `quote_request` - Request for quote
- `contact` - Contact form
- `partnership` - Partnership inquiries
- `support` - Support requests

### Status Types
- `pending` - New submission (default)
- `responded` - Admin has responded
- `resolved` - Issue resolved
- `spam` - Marked as spam

## Email Templates

The system sends two types of emails:

1. **Admin Notification**: Sent to admin when a form is submitted
2. **User Auto-Response**: Sent to the user confirming receipt

Both emails include:
- Form submission details
- Link to product catalog
- Professional HTML formatting
- Company branding

## API Usage Examples

### Submit a Form
```bash
curl -X POST http://localhost:3000/api/v1/form-submissions \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "subject": "Product inquiry",
    "message": "I would like to know more about your products.",
    "formType": "inquiry"
  }'
```

### Get Submissions (Admin)
```bash
curl -X GET "http://localhost:3000/api/v1/form-submissions/admin?page=1&pageSize=10&status=pending" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Status (Admin)
```bash
curl -X PUT http://localhost:3000/api/v1/form-submissions/admin/123/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "responded"}'
```

## Troubleshooting

### Email Not Sending
1. Check SMTP credentials in environment variables
2. Test email service connection: `GET /api/v1/form-submissions/admin/email-service/check`
3. Check server logs for email errors
4. Verify firewall allows SMTP port (587/465)

### Common Issues
- **Gmail "Less secure app access"**: Use App Passwords instead
- **Office 365**: May require OAuth2 setup for production
- **Network issues**: Check if hosting provider blocks SMTP ports

## Security Considerations

- Form submissions are rate-limited by request IP
- Admin endpoints require JWT authentication
- Email content is sanitized to prevent XSS
- IP address and user agent are logged for security

## Integration with Frontend

The API is designed to work with any frontend framework. Example React integration:

```javascript
const submitForm = async (formData) => {
  const response = await fetch('/api/v1/form-submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  });
  
  const result = await response.json();
  return result;
};
```