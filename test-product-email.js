#!/usr/bin/env node

/**
 * Test Script for Product Email API
 * 
 * This script tests the product email endpoint that sends professional
 * product information emails based on email and product code
 * Make sure the server is running before executing this script
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3022';
const API_ENDPOINT = `${API_BASE_URL}/api/v1/form-submissions/send-product-email`;

async function testProductEmail() {
  console.log('📧 Testing Product Email API...\n');

  // Test data
  const testCases = [
    {
      name: 'Valid product email request',
      data: {
        email: 'indonesia.dds@gmail.com',
        product_code: 'EBA 1261-70 T 3'
      },
      expectedStatus: 201
    },
    {
      name: 'Valid product email request with different product',
      data: {
        email: 'test@example.com',
        product_code: 'EBA 1261-70 T'
      },
      expectedStatus: 201
    },
    {
      name: 'Missing email field',
      data: {
        product_code: 'ETA_01'
      },
      expectedStatus: 400
    },
    {
      name: 'Missing product_code field',
      data: {
        email: 'indonesia.dds@gmail.com'
      },
      expectedStatus: 400
    },
    {
      name: 'Invalid email format',
      data: {
        email: 'invalid-email',
        product_code: 'ETA_01'
      },
      expectedStatus: 400
    },
    {
      name: 'Non-existent product code',
      data: {
        email: 'indonesia.dds@gmail.com',
        product_code: 'NONEXISTENT_999'
      },
      expectedStatus: 404
    }
  ];

  for (const testCase of testCases) {
    console.log(`📝 Testing: ${testCase.name}`);
    console.log(`   Data: ${JSON.stringify(testCase.data, null, 2)}`);

    try {
      const response = await axios.post(API_ENDPOINT, testCase.data);
      
      if (response.status === testCase.expectedStatus) {
        console.log(`   ✅ Success: Status ${response.status}`);
        console.log(`   📧 Email sent: ${response.data.data?.emailSent || 'N/A'}`);
        console.log(`   💬 Message: ${response.data.message}`);
        
        // Show product info if available
        if (response.data.data?.product) {
          console.log(`   🏷️  Product: ${JSON.stringify(response.data.data.product, null, 6)}`);
        }
        
        // Show submission ID
        if (response.data.data?.id) {
          console.log(`   🔢 Submission ID: ${response.data.data.id}`);
        }
      } else {
        console.log(`   ❌ Unexpected status: Expected ${testCase.expectedStatus}, got ${response.status}`);
      }
    } catch (error) {
      if (error.response && error.response.status === testCase.expectedStatus) {
        console.log(`   ✅ Expected error: Status ${error.response.status}`);
        console.log(`   🚫 Message: ${error.response.data.message || 'N/A'}`);
        console.log(`   🚫 Errors: ${error.response.data.errors?.join(', ') || 'N/A'}`);
      } else {
        console.log(`   ❌ Unexpected error:`, error.message);
        if (error.response) {
          console.log(`   📄 Response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
      }
    }
    console.log('');
  }
}

async function testEmailService() {
  console.log('📧 Testing Email Service Connection...');
  console.log('   ℹ️  Note: Email service check requires admin authentication, skipping detailed check');
  console.log('   💡 Email functionality will be tested through the actual product email endpoint\n');
}

async function testProductsEndpoint() {
  console.log('🏷️  Testing Products Endpoint to verify available products...\n');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/products`);
    if (response.data && response.data.data && response.data.data.data) {
      const products = response.data.data.data;
      console.log(`   📦 Found ${products.length} products:`);
      products.slice(0, 5).forEach(product => {
        console.log(`      - Code: ${product.code} | Type: ${product.type} | Application: ${product.application_en || product.application || 'N/A'}`);
      });
      if (products.length > 5) {
        console.log(`      ... and ${products.length - 5} more products`);
      }
    } else {
      console.log('   ⚠️  No products found or unexpected response structure');
    }
  } catch (error) {
    console.log(`   ❌ Failed to fetch products: ${error.message}`);
    console.log('   💡 Make sure the products endpoint is available and products exist in the database');
  }
  console.log('');
}

async function runTests() {
  console.log('🚀 Starting API Tests for Product Email Endpoint\n');
  console.log(`🌐 API Endpoint: ${API_ENDPOINT}\n`);

  await testEmailService();
  await testProductsEndpoint();
  await testProductEmail();

  console.log('🏁 Tests completed!');
  console.log('\n📋 Next steps:');
  console.log('   1. Check your email inbox for professional product emails');
  console.log('   2. Verify admin received notifications');
  console.log('   3. Check the database for saved submissions');
  console.log('   4. Verify the email template looks professional and attractive');
  console.log('\n💡 Tips:');
  console.log('   - Make sure you have products with codes like "EBA 1261-70 T 3" in your database');
  console.log('   - Verify your SMTP settings are configured correctly');
  console.log('   - Check spam folders if emails are not received');
}

// Handle command line execution
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  });
}

module.exports = { testProductEmail, testEmailService, testProductsEndpoint };