#!/usr/bin/env node

/**
 * Test Script for Resend Email Functionality
 * 
 * This script tests the admin resend email endpoints to ensure
 * the send and resend functionality works on the product email analytics page
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3022';
const LOGIN_ENDPOINT = `${API_BASE_URL}/api/v1/auth/login`;
const RESEND_ENDPOINT = `${API_BASE_URL}/api/v1/form-submissions/admin`;
const EMAIL_SERVICE_CHECK = `${API_BASE_URL}/api/v1/form-submissions/admin/email-service/check`;

// Test admin credentials (make sure these exist in your database)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

let authToken = null;

async function login() {
  console.log('🔐 Logging in as admin...');
  
  try {
    const response = await axios.post(LOGIN_ENDPOINT, ADMIN_CREDENTIALS);
    
    if (response.data && response.data.token) {
      authToken = response.data.token;
      console.log('   ✅ Login successful');
      return true;
    } else {
      console.log('   ❌ Login failed: No token received');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testEmailServiceCheck() {
  console.log('\n📧 Testing Email Service Status Check...');
  
  try {
    const response = await axios.get(EMAIL_SERVICE_CHECK, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('   ✅ Email service check successful');
    console.log(`   📊 Status: ${response.data.status}`);
    console.log(`   🔌 Connected: ${response.data.data.emailServiceConnected}`);
    
    if (response.data.data.error) {
      console.log(`   ⚠️  Error: ${response.data.data.error}`);
    }
    
    return response.data.data.emailServiceConnected;
  } catch (error) {
    console.log('   ❌ Email service check failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function getRecentSubmissions() {
  console.log('\n📋 Fetching recent form submissions...');
  
  try {
    const response = await axios.get(`${RESEND_ENDPOINT}?formType=product_email&pageSize=5`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const submissions = response.data.data.items;
    console.log(`   ✅ Found ${submissions.length} recent product email submissions`);
    
    if (submissions.length > 0) {
      console.log('   📄 Recent submissions:');
      submissions.forEach((sub, index) => {
        console.log(`      ${index + 1}. ID: ${sub.id} | Email: ${sub.email} | Product: ${sub.productCode} | Status: ${sub.status}`);
      });
    }
    
    return submissions;
  } catch (error) {
    console.log('   ❌ Failed to fetch submissions:', error.response?.data?.message || error.message);
    return [];
  }
}

async function testResendEmail(submissionId) {
  console.log(`\n🔄 Testing resend email for submission ID: ${submissionId}...`);
  
  try {
    const response = await axios.post(`${RESEND_ENDPOINT}/${submissionId}/resend-email`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('   ✅ Resend email successful');
    console.log(`   📊 Status: ${response.data.status}`);
    console.log(`   💬 Message: ${response.data.message}`);
    console.log(`   📧 Email sent: ${response.data.data.emailSent}`);
    
    if (response.data.data.messageId) {
      console.log(`   🆔 Message ID: ${response.data.data.messageId}`);
    }
    
    return true;
  } catch (error) {
    console.log('   ❌ Resend email failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testUpdateStatus(submissionId, newStatus) {
  console.log(`\n📝 Testing status update for submission ID: ${submissionId} to status: ${newStatus}...`);
  
  try {
    const response = await axios.put(`${RESEND_ENDPOINT}/${submissionId}/status`, {
      status: newStatus
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('   ✅ Status update successful');
    console.log(`   📊 Status: ${response.data.status}`);
    console.log(`   💬 Message: ${response.data.message}`);
    
    return true;
  } catch (error) {
    console.log('   ❌ Status update failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function createTestSubmission() {
  console.log('\n➕ Creating a test submission...');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/form-submissions/send-product-email`, {
      email: 'test-resend@example.com',
      product_code: 'EBA 1261-70 T 3'
    });
    
    console.log('   ✅ Test submission created');
    console.log(`   🆔 Submission ID: ${response.data.data.id}`);
    console.log(`   📧 Email sent: ${response.data.data.emailSent}`);
    
    return response.data.data.id;
  } catch (error) {
    console.log('   ❌ Failed to create test submission:', error.response?.data?.message || error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Resend Email Functionality Tests\n');
  console.log(`🌐 API Base URL: ${API_BASE_URL}\n`);
  
  // Step 1: Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('\n❌ Tests aborted due to login failure');
    return;
  }
  
  // Step 2: Check email service status
  const emailServiceConnected = await testEmailServiceCheck();
  
  // Step 3: Get recent submissions
  let submissions = await getRecentSubmissions();
  
  // Step 4: Create a test submission if none exist
  if (submissions.length === 0) {
    const newSubmissionId = await createTestSubmission();
    if (newSubmissionId) {
      // Fetch submissions again
      submissions = await getRecentSubmissions();
    }
  }
  
  // Step 5: Test resend functionality
  if (submissions.length > 0) {
    const testSubmission = submissions[0];
    
    // Test resend email
    const resendSuccess = await testResendEmail(testSubmission.id);
    
    // Test status update
    if (resendSuccess) {
      await testUpdateStatus(testSubmission.id, 'sent');
    }
    
    // Test another resend after status update
    if (resendSuccess) {
      console.log('\n🔄 Testing second resend after status update...');
      await testResendEmail(testSubmission.id);
    }
  } else {
    console.log('\n⚠️  No submissions available for testing resend functionality');
  }
  
  console.log('\n🏁 Resend Email Functionality Tests Completed!');
  console.log('\n📋 Summary:');
  console.log(`   🔐 Admin login: ${loginSuccess ? 'Success' : 'Failed'}`);
  console.log(`   📧 Email service: ${emailServiceConnected ? 'Connected' : 'Disconnected'}`);
  console.log(`   📊 Submissions found: ${submissions.length}`);
  
  console.log('\n💡 If all tests passed, the send and resend email functionality should be working correctly in the admin interface.');
}

// Handle command line execution
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  });
}

module.exports = { runTests, testResendEmail, testEmailServiceCheck };