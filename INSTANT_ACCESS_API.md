# Instant Access Form API

## Overview
This API endpoint handles the "Get Instant Access" form submissions. When users submit this form, they receive immediate access to the product catalog via email.

## Endpoint
```
POST /api/v1/form-submissions/instant-access
```

## Request Body
```json
{
  "fullName": "John Doe",           // Required: User's full name
  "email": "john@example.com",      // Required: Valid email address
  "phone": "+1234567890",           // Required: Phone number
  "company": "Tech Corp",           // Optional: Company name
  "city": "New York"                // Optional: City
}
```

## Response
### Success (201)
```json
{
  "status": "success",
  "message": "Thank you! Check your email for instant access to our product catalog.",
  "data": {
    "id": 123,
    "emailSent": true,
    "message": "We've sent you an email with direct access to our complete product catalog."
  }
}
```

### Error (400)
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    "Full name is required",
    "Valid email address is required"
  ]
}
```

## Email Functionality
The API automatically sends two emails:

1. **Admin Notification**: Alerts administrators about new instant access requests
2. **User Response**: Sends the user immediate access to the product catalog with a **personalized link**

### 🔗 Personalized Links with Base64 Encoding
The product catalog links sent to users contain their information encoded in base64 format:

**Link Format:**
```
https://yourcompany.com/products?access=eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJ0aW1lc3RhbXAiOiIyMDI0LTEyLTAzVDEwOjAwOjAwLjAwMFoifQ==
```

**Decoded Data Structure:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "timestamp": "2024-12-03T10:00:00.000Z"
}
```

**Benefits:**
- **Personalized Experience**: Greet users by name on the product page
- **Access Tracking**: Know who accessed your catalog and when
- **Lead Analytics**: Track user behavior with contact information
- **Quote Pre-filling**: Auto-fill contact forms for easier conversions
- **Link Validation**: Optional expiration checking

## Setup Requirements

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and configure:

```env
# SMTP Configuration (Required)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Company Information
COMPANY_NAME=Your Company Name
WEBSITE_URL=https://yourcompany.com
ADMIN_EMAIL=admin@yourcompany.com
```

### 3. Database Migration
Run the migration to add support for the instant access form:
```sql
-- Execute: migrations/add-city-and-instant-access-form-type.sql
```

### 4. Gmail Setup (if using Gmail SMTP)
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" for the application
3. Use the app password in `SMTP_PASS` environment variable

## Frontend Integration

### 🔓 Decoding User Data from Links

**JavaScript Decoder (Browser):**
```javascript
function decodeUserData(encodedData) {
  try {
    const jsonString = atob(encodedData); // Browser base64 decode
    const userData = JSON.parse(jsonString);
    return userData;
  } catch (error) {
    console.error('Failed to decode user data:', error);
    return null;
  }
}

// Get user data from current URL
function getUserFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const accessParam = params.get('access');
  return accessParam ? decodeUserData(accessParam) : null;
}

// Use in your product page
const userData = getUserFromUrl();
if (userData) {
  document.getElementById('welcome').textContent = `Welcome, ${userData.name}!`;
  console.log('User email:', userData.email);
  console.log('Access requested:', userData.timestamp);
}
```

**Node.js Decoder (Backend):**
```javascript
const LinkDecoder = require('./src/utils/linkDecoder');

// Decode from URL parameter
const userData = LinkDecoder.decodeUserData(encodedString);

// Extract from full URL
const accessParam = LinkDecoder.extractAccessParam(fullUrl);
const userData = LinkDecoder.decodeUserData(accessParam);

// Create personalized greeting
const greeting = LinkDecoder.createGreeting(userData);
// Returns: "Good morning, John Doe! Welcome to our product catalog."
```

### 🎨 Personalized Product Page Example
```html
<!-- Welcome Banner -->
<div id="welcomeBanner" class="welcome-banner" style="display: none;">
  <h2 id="welcomeMessage">Welcome!</h2>
  <p>Thank you for requesting access to our products.</p>
</div>

<script>
// Check for personalized access
const userData = getUserFromUrl();
if (userData) {
  // Show personalized content
  document.getElementById('welcomeBanner').style.display = 'block';
  document.getElementById('welcomeMessage').textContent = 
    `Welcome, ${userData.name}!`;
  
  // Pre-fill contact forms
  document.getElementById('contactName').value = userData.name;
  document.getElementById('contactEmail').value = userData.email;
  
  // Track access for analytics
  fetch('/api/v1/analytics/product-access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      accessedAt: new Date().toISOString()
    })
  });
}
</script>
```
```html
<form id="instantAccessForm">
  <input type="text" name="fullName" placeholder="Full name (required)" required>
  <input type="email" name="email" placeholder="Enter email (required)" required>
  <input type="tel" name="phone" placeholder="Phone number (required)" required>
  <input type="text" name="company" placeholder="Company (optional)">
  <input type="text" name="city" placeholder="City (optional)">
  <button type="submit">Get Instant Access</button>
</form>
```

### JavaScript Example
```javascript
document.getElementById('instantAccessForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('/api/v1/form-submissions/instant-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      alert(result.message);
    } else {
      alert('Error: ' + result.errors.join(', '));
    }
  } catch (error) {
    alert('Network error. Please try again.');
  }
});
```

## Testing
You can test the API using curl:

```bash
curl -X POST http://localhost:3000/api/v1/form-submissions/instant-access \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "company": "Test Company",
    "city": "Test City"
  }'
```

## Admin Features
Admins can view and manage instant access requests through the existing admin endpoints:
- GET `/api/v1/form-submissions/admin` - View all submissions
- GET `/api/v1/form-submissions/admin/{id}` - View specific submission
- PUT `/api/v1/form-submissions/admin/{id}/status` - Update status

## Email Templates
The system uses responsive HTML email templates that include:
- Welcome message with branding
- Direct link to product catalog
- Professional styling
- Mobile-friendly design