#!/usr/bin/env node

/**
 * Test Script for Instant Access Form API
 * 
 * This script tests the instant access form endpoint
 * Make sure the server is running before executing this script
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const API_ENDPOINT = `${API_BASE_URL}/api/v1/form-submissions/instant-access`;

async function testInstantAccessForm() {
  console.log('🧪 Testing Instant Access Form API...\n');

  // Test data
  const testCases = [
    {
      name: 'Valid submission',
      data: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        company: 'Tech Corporation',
        city: 'New York'
      },
      expectedStatus: 201
    },
    {
      name: 'Missing required fields',
      data: {
        fullName: 'Jane Smith'
        // Missing email and phone
      },
      expectedStatus: 400
    },
    {
      name: 'Invalid email format',
      data: {
        fullName: 'Bob Wilson',
        email: 'invalid-email',
        phone: '+1234567890'
      },
      expectedStatus: 400
    },
    {
      name: 'Minimal valid data',
      data: {
        fullName: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '555-1234'
      },
      expectedStatus: 201
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
      } else {
        console.log(`   ❌ Unexpected status: Expected ${testCase.expectedStatus}, got ${response.status}`);
      }
    } catch (error) {
      if (error.response && error.response.status === testCase.expectedStatus) {
        console.log(`   ✅ Expected error: Status ${error.response.status}`);
        console.log(`   🚫 Errors: ${error.response.data.errors?.join(', ') || error.response.data.message}`);
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
  console.log('📧 Testing Email Service Connection...\n');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/form-submissions/admin/email-service/check`);
    console.log(`   ✅ Email service status: ${response.data.data.emailServiceConnected ? 'Connected' : 'Disconnected'}`);
  } catch (error) {
    console.log(`   ❌ Failed to check email service: ${error.message}`);
  }
  console.log('');
}

async function runTests() {
  console.log('🚀 Starting API Tests for Instant Access Form\n');
  console.log(`🌐 API Endpoint: ${API_ENDPOINT}\n`);

  await testEmailService();
  await testInstantAccessForm();

  console.log('🏁 Tests completed!');
  console.log('\n📋 Next steps:');
  console.log('   1. Check your email inbox for test messages');
  console.log('   2. Verify admin received notifications');
  console.log('   3. Test the product catalog link in the email');
  console.log('   4. Check the database for saved submissions');
}

// Handle command line execution
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  });
}

module.exports = { testInstantAccessForm, testEmailService };