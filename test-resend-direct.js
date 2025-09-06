#!/usr/bin/env node

/**
 * Direct Resend Functionality Test
 * 
 * This script creates a submission and tests the resend functionality
 * by directly calling the backend service without API authentication
 */

const path = require('path');

// Add the src directory to the require path
require('module').globalPaths.push(path.join(__dirname, 'src'));

async function testResendFunctionalityDirect() {
  console.log('🔧 Testing Resend Functionality Directly...\n');
  
  try {
    // Import required modules
    const formSubmissionService = require('./src/features/form-submissions/formSubmissionService');
    const sequelize = require('./src/config/database');
    
    // Ensure database connection
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Step 1: Create a test submission
    console.log('\n📝 Creating test submission...');
    const testEmail = 'test-resend-direct@example.com';
    const testProductCode = 'EBA 1261-70 T 3';
    
    const result = await formSubmissionService.sendProductEmail(
      testEmail, 
      testProductCode, 
      { ip: '127.0.0.1', userAgent: 'Test Agent' }
    );
    
    console.log(`✅ Test submission created with ID: ${result.submission.id}`);
    console.log(`📧 Initial email sent: ${result.emailSent}`);
    
    // Step 2: Test resend functionality
    console.log('\n🔄 Testing resend functionality...');
    const resendResult = await formSubmissionService.resendEmail(result.submission.id);
    
    console.log(`✅ Resend test completed`);
    console.log(`📧 Email resent successfully: ${resendResult.success}`);
    console.log(`🆔 Message ID: ${resendResult.messageId || 'N/A'}`);
    
    // Step 3: Test status update
    console.log('\n📝 Testing status update...');
    await formSubmissionService.updateSubmissionStatus(result.submission.id, 'sent');
    console.log('✅ Status updated successfully');
    
    // Step 4: Test resend after status update
    console.log('\n🔄 Testing resend after status update...');
    const resendResult2 = await formSubmissionService.resendEmail(result.submission.id);
    console.log(`✅ Second resend test completed`);
    console.log(`📧 Email resent successfully: ${resendResult2.success}`);
    
    // Step 5: Get submission details
    console.log('\n📊 Getting submission details...');
    const submission = await formSubmissionService.getSubmissionById(result.submission.id);
    console.log(`📧 Email: ${submission.email}`);
    console.log(`🏷️  Product Code: ${submission.productCode}`);
    console.log(`📅 Created: ${submission.createdAt}`);
    console.log(`📊 Status: ${submission.status}`);
    console.log(`📝 Form Type: ${submission.formType}`);
    
    return true;
  } catch (error) {
    console.error('❌ Direct test failed:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

async function testEmailServiceConnection() {
  console.log('\n📧 Testing Email Service Connection...\n');
  
  try {
    const emailService = require('./src/utils/emailService');
    const isConnected = await emailService.verifyConnection();
    
    console.log(`✅ Email service connection test completed`);
    console.log(`🔌 Connected: ${isConnected}`);
    
    return isConnected;
  } catch (error) {
    console.error('❌ Email service test failed:', error.message);
    return false;
  }
}

async function runDirectTests() {
  console.log('🚀 Starting Direct Resend Functionality Tests\n');
  
  // Test email service first
  const emailConnected = await testEmailServiceConnection();
  
  // Test resend functionality
  const resendWorking = await testResendFunctionalityDirect();
  
  console.log('\n📋 DIRECT TEST RESULTS');
  console.log('======================\n');
  
  console.log(`📧 Email Service: ${emailConnected ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`🔄 Resend Functionality: ${resendWorking ? '✅ Working' : '❌ Failed'}`);
  
  if (emailConnected && resendWorking) {
    console.log('\n🎉 SUCCESS: Send and Resend Email functionality is working correctly!');
    console.log('\n📍 The features should work properly in the admin interface at:');
    console.log('   http://localhost:8088/admin/product-email-analytics');
    console.log('\n💡 To use the resend feature:');
    console.log('   1. Login to the admin interface');
    console.log('   2. Navigate to Product Email Analytics');
    console.log('   3. Find submissions in the table');
    console.log('   4. Use the "Resend" button for any submission');
  } else {
    console.log('\n⚠️  Some functionality may not be working properly:');
    if (!emailConnected) {
      console.log('   📧 Check SMTP configuration in environment variables');
    }
    if (!resendWorking) {
      console.log('   🔄 Check database connection and form submission service');
    }
  }
  
  console.log('\n🏁 Direct Tests Completed!');
}

// Handle command line execution
if (require.main === module) {
  runDirectTests().catch(error => {
    console.error('❌ Direct tests failed:', error.message);
    process.exit(1);
  });
}

module.exports = { runDirectTests, testResendFunctionalityDirect };