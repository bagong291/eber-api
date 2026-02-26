# Dokumentasi Backend - Company Profile API

Dokumentasi lengkap untuk backend service Eber Corporate Platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Struktur Project](#struktur-project)
4. [Konfigurasi](#konfigurasi)
5. [Database](#database)
6. [Feature Modules](#feature-modules)
7. [API Endpoints](#api-endpoints)
8. [Authentication](#authentication)
9. [Middleware](#middleware)
10. [Deployment](#deployment)

---

## Overview

Backend API service yang dibangun dengan Node.js dan Express, menyediakan REST API untuk mengelola:
- Company Profile & Corporate Data
- Product Catalog dengan Segmentasi
- Articles/Blog Posts
- Career Listings & Applications
- Form Submissions (Instant Access, Contact, Product Email)
- Certificates
- File Uploads (Cloudinary & Local)
- Email Services

---

## Tech Stack

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| Runtime | Node.js | 18+ |
| Framework | Express.js | 4.18.2 |
| Database | PostgreSQL | 13+ |
| ORM | Sequelize | 6.32.1 |
| Authentication | JWT | 9.0.0 |
| Password Hash | bcrypt | 5.1.0 |
| File Upload | multer | 2.0.1 |
| Cloud Storage | Cloudinary | 2.6.1 |
| Email | Nodemailer | 6.10.1 |
| API Documentation | Swagger UI | 4.6.3 |
| Logging | morgan | 1.10.0 |
| HTTP Client | axios | 1.10.0 |

---

## Struktur Project

```
company-profile-api/
├── src/
│   ├── app.js                    # Express app initialization
│   ├── server.js                 # Server entry point
│   ├── config/
│   │   ├── database.js           # Sequelize configuration
│   │   ├── default.js            # App configuration
│   │   └── swagger-docs.js       # Swagger documentation
│   ├── features/                 # Feature modules (14 modules)
│   │   ├── articles/             # Article management
│   │   ├── careers/              # Career listings & applications
│   │   ├── certificates/         # Certificates management
│   │   ├── company-profile/      # Company profile data
│   │   ├── company-top-products/ # Company top products
│   │   ├── contacts/             # Contact form handling
│   │   ├── dashboard/            # Dashboard statistics
│   │   ├── email-sender/         # Email sending service
│   │   ├── form-submissions/     # Form submissions management
│   │   ├── home/                 # Home page data
│   │   ├── products/             # Product catalog
│   │   ├── top-products/         # Top products ranking
│   │   ├── upload/               # File upload handling
│   │   └── users/                # User authentication
│   ├── middlewares/
│   │   ├── auth.js               # JWT authentication
│   │   ├── errorHandler.js       # Global error handler
│   │   └── uploadMiddleware.js   # File upload middleware
│   ├── public/uploads/           # Static file uploads
│   ├── seeders/                  # Database seeders
│   └── utils/                    # Utility functions
├── migrations/                   # Database migrations
├── docs/                         # API documentation
├── .env                          # Environment variables
├── docker-compose.yml            # Docker configuration
└── package.json
```

### Feature Module Structure

Setiap feature module mengikuti pola yang konsisten:

```
feature-name/
├── FeatureName.js              # Sequelize model
├── featureController.js        # Request handlers
├── featureService.js           # Business logic
├── featureRepository.js        # Database operations
├── featureRoutes.js            # Route definitions
└── featureRoutes.docs.js       # Swagger documentation
```

---

## Konfigurasi

### Environment Variables (.env)

```env
# Server Configuration
PORT=3022
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eber_company_profile
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_min_32_chars
ADMIN_SECRET=your_admin_secret

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000
```

### Database Configuration (src/config/database.js)

```javascript
const { Sequelize } = require('sequelize');
const config = require('./default').db;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
    define: {
      underscored: true,
      freezeTableName: true
    }
  }
);

module.exports = sequelize;
```

### App Configuration (src/config/default.js)

```javascript
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  adminSecret: process.env.ADMIN_SECRET,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'company_profile',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    dialect: 'postgres'
  }
};
```

---

## Database

### Models Overview

| Model | File | Description |
|-------|------|-------------|
| Product | `products/Product.js` | Product catalog dengan multi-language |
| Article | `articles/Article.js` | Blog articles dengan multi-language |
| Career | `careers/Career.js` | Job postings |
| Application | `careers/Application.js` | Job applications |
| Certificate | `certificates/Certificate.js` | Company certificates |
| FormSubmission | `form-submissions/FormSubmission.js` | Form submissions |
| User | `users/User.js` | Admin users |
| CompanyProfile | `company-profile/CompanyProfile.js` | Company data |
| TopProduct | `top-products/TopProduct.js` | Top products ranking |
| CompanyTopProduct | `company-top-products/CompanyTopProduct.js` | Company-specific top products |

### Product Model Structure

```javascript
{
  id: INTEGER (PK, Auto Increment)
  code: STRING (Unique)
  name_en: STRING
  name_id: STRING
  description_en: TEXT
  description_id: TEXT
  application_en: TEXT
  application_id: TEXT
  performanceFeature_en: TEXT
  performanceFeature_id: TEXT
  segment: STRING
  groupSbu: STRING
  sbuName: STRING
  groupName: STRING
  image: STRING
  createdAt: DATE
  updatedAt: DATE
}
```

### Article Model Structure

```javascript
{
  id: INTEGER (PK, Auto Increment)
  title_en: STRING
  title_id: STRING
  content_en: TEXT
  content_id: TEXT
  image: STRING
  pdfUrl: STRING
  status: ENUM('draft', 'published')
  createdAt: DATE
  updatedAt: DATE
}
```

### Form Submission Model Structure

```javascript
{
  id: INTEGER (PK, Auto Increment)
  formType: ENUM('instant_access', 'contact', 'product_email')
  name: STRING
  email: STRING
  phone: STRING
  company: STRING
  message: TEXT
  productCode: STRING
  status: ENUM('pending', 'processed', 'email_sent', 'email_failed')
  emailStatus: ENUM('pending', 'sent', 'failed')
  emailSentAt: DATE
  createdAt: DATE
  updatedAt: DATE
}
```

---

## Feature Modules

### 1. Products (`/api/v1/products`)

**Files:**
- `Product.js` - Model definition
- `productController.js` - Request handlers
- `productService.js` - Business logic
- `productRepository.js` - Database queries
- `productRoutes.js` - Route definitions

**Features:**
- CRUD operations
- Multi-language support (EN/ID)
- Segment-based categorization (Automotive, Industrial, etc.)
- Search & filtering
- Bulk upload via CSV
- Pagination

**Key Methods:**
```javascript
// productService.js
listProducts(filter, page, pageSize)
getProductById(id)
createProduct(data)
updateProduct(id, data)
deleteProduct(id)
bulkUploadProducts(csvData)
searchProducts(query, filters)
```

### 2. Articles (`/api/v1/articles`)

**Features:**
- CRUD operations
- Multi-language content
- Image upload
- PDF attachment
- Publish/draft status

### 3. Careers (`/api/v1/careers`)

**Features:**
- Job postings CRUD
- Multi-language descriptions
- Job applications with resume upload
- Application status tracking

### 4. Form Submissions (`/api/v1/form-submissions`)

**Features:**
- Instant Access form
- Contact form
- Product Email form
- Email auto-response
- Status tracking
- Resend email functionality
- Statistics dashboard

**Routes:**
```javascript
POST   /instant-access              # Public: Submit instant access
POST   /send-product-email          # Public: Send product email
POST   /                           # Public: Submit generic form
GET    /admin                      # Admin: List submissions
GET    /admin/statistics           # Admin: Get statistics
GET    /admin/email-service/check  # Admin: Check email service
GET    /admin/:id                  # Admin: Get submission detail
PUT    /admin/:id/status           # Admin: Update status
POST   /admin/:id/resend-email     # Admin: Resend email
```

### 5. Certificates (`/api/v1/certificates`)

**Features:**
- Certificate image upload
- Status management
- Public & admin endpoints

### 6. Company Profile (`/api/v1/corporate`, `/api/v1/admin-company-profile`)

**Features:**
- Company information management
- Corporate entities
- About us content
- Multi-language support

### 7. Users & Authentication (`/api/v1/auth`, `/api/v1/users`)

**Features:**
- JWT-based authentication
- User registration/login
- Password hashing with bcrypt
- Protected routes middleware

### 8. Email Sender (`/api/v1/email`)

**Features:**
- Send custom emails
- Email templates
- SMTP configuration

### 9. Upload (`/api/v1/upload`)

**Features:**
- Image upload (Cloudinary)
- PDF upload
- Local file storage
- File deletion

### 10. Dashboard (`/api/v1/dashboard`)

**Features:**
- Statistics overview
- Recent data summary
- Count metrics

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | Login user | Public |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/products` | List products | Optional |
| GET | `/api/v1/products/:id` | Get product detail | Optional |
| POST | `/api/v1/products` | Create product | Required |
| PUT | `/api/v1/products/:id` | Update product | Required |
| DELETE | `/api/v1/products/:id` | Delete product | Required |
| POST | `/api/v1/products/bulk-upload` | Bulk upload CSV | Required |
| DELETE | `/api/v1/products` | Delete all products | Required |

### Articles

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/articles` | List articles | Optional |
| GET | `/api/v1/articles/:id` | Get article detail | Optional |
| POST | `/api/v1/articles` | Create article | Required |
| PUT | `/api/v1/articles/:id` | Update article | Required |
| DELETE | `/api/v1/articles/:id` | Delete article | Required |

### Careers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/careers` | List careers | Optional |
| GET | `/api/v1/careers/:id` | Get career detail | Optional |
| POST | `/api/v1/careers` | Create career | Required |
| PUT | `/api/v1/careers/:id` | Update career | Required |
| DELETE | `/api/v1/careers/:id` | Delete career | Required |
| POST | `/api/v1/careers/apply` | Submit application | Public |

### Form Submissions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/form-submissions/instant-access` | Submit instant access | Public |
| POST | `/api/v1/form-submissions/send-product-email` | Send product email | Public |
| POST | `/api/v1/form-submissions` | Submit form | Public |
| GET | `/api/v1/form-submissions/admin` | List submissions | Required |
| GET | `/api/v1/form-submissions/admin/statistics` | Get statistics | Required |
| GET | `/api/v1/form-submissions/admin/:id` | Get submission | Required |
| PUT | `/api/v1/form-submissions/admin/:id/status` | Update status | Required |
| POST | `/api/v1/form-submissions/admin/:id/resend-email` | Resend email | Required |

### Certificates

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/certificates` | List certificates | Optional |
| GET | `/api/v1/certificates/:id` | Get certificate | Optional |
| POST | `/api/v1/certificates` | Create certificate | Required |
| PUT | `/api/v1/certificates/:id` | Update certificate | Required |
| DELETE | `/api/v1/certificates/:id` | Delete certificate | Required |

### Company Profile

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/corporate` | List company profiles | Public |
| GET | `/api/v1/corporate/:id` | Get company profile | Public |
| POST | `/api/v1/corporate` | Create profile | Required |
| PUT | `/api/v1/corporate/:id` | Update profile | Required |
| DELETE | `/api/v1/corporate/:id` | Delete profile | Required |

### Top Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/top-products` | List top products | Public |
| POST | `/api/v1/top-products` | Add top product | Required |
| PUT | `/api/v1/top-products/:id` | Update rank | Required |
| DELETE | `/api/v1/top-products/:id` | Remove | Required |

### Company Top Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/company-top-products` | List all | Public |
| GET | `/api/v1/company-top-products/company/:companyId` | By company | Public |
| POST | `/api/v1/company-top-products` | Add | Required |
| PUT | `/api/v1/company-top-products/:id` | Update | Required |
| DELETE | `/api/v1/company-top-products/:id` | Remove | Required |

### Email

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/email/send/:type` | Send email | Required |

### Upload

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/upload` | Upload file | Required |

### Dashboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/dashboard` | Get statistics | Required |

---

## Authentication

### JWT Implementation

**Middleware:** `src/middlewares/auth.js`

```javascript
// authenticate - Required authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// authenticateOptional - Optional authentication
const authenticateOptional = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (!err) req.user = decoded;
    });
  }
  next();
};
```

### Login Flow

1. User sends POST `/api/v1/auth/login` with username & password
2. Server validates credentials against database
3. Server generates JWT token with user info
4. Token returned to client
5. Client includes token in `Authorization: Bearer <token>` header

### Password Hashing

```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Compare password
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

---

## Middleware

### Auth Middleware (`src/middlewares/auth.js`)

- `authenticate` - Verifies JWT token, rejects if invalid
- `authenticateOptional` - Verifies token if present, continues regardless

### Error Handler (`src/middlewares/errorHandler.js`)

Global error handling middleware:
```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};
```

### Upload Middleware (`src/middlewares/uploadMiddleware.js`)

Handles file uploads using multer:
- Image uploads
- PDF uploads
- File validation
- Size limits

---

## Deployment

### Local Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run migrations (if needed)
npm run migrate

# Run seeders (optional)
npm run seed

# Start development server
npm run dev
```

### Production Deployment

```bash
# Install production dependencies
npm install --production

# Set environment
export NODE_ENV=production

# Start server
npm start
```

### Docker Deployment

```bash
# Build image
docker build -t company-profile-api .

# Run container
docker run -d \
  -p 3022:3022 \
  --env-file .env \
  --name company-profile-api \
  company-profile-api
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run swagger` | Generate Swagger documentation |
| `npm run seed` | Run database seeders |

---

## API Documentation

Swagger UI tersedia di: `http://localhost:3022/api-docs`

---

## Related Documentation

| File | Description |
|------|-------------|
| `CAREER_APPLICATION_API.md` | Career application API details |
| `CERTIFICATES_FEATURE.md` | Certificates feature documentation |
| `CURL_EXAMPLES.md` | cURL examples for API testing |
| `EMAIL_MIGRATION.md` | Email system migration guide |
| `INSTANT_ACCESS_API.md` | Instant Access form API |
| `UPLOAD_API_GUIDE.md` | File upload API guide |
| `docs/swagger-output.json` | Swagger API specification |

---

## License

Private - Eber Group Internal Use
