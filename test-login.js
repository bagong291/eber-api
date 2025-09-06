#!/usr/bin/env node

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3022';

async function testLogin() {
  console.log('🔐 Testing different login combinations...\n');
  
  const loginCombinations = [
    { username: 'admin', password: 'admin123' },
    { username: 'admin', password: 'admin' },
    { username: 'admin', password: 'password' },
    { email: 'admin@example.com', password: 'admin123' },
    { email: 'admin@eber.com', password: 'admin123' }
  ];
  
  for (const creds of loginCombinations) {
    console.log(`Trying: ${JSON.stringify(creds)}`);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, creds);
      console.log(`   ✅ Success!`);
      console.log(`   Token: ${response.data.token}`);
      console.log(`   Full response: ${JSON.stringify(response.data, null, 2)}`);
      break;
    } catch (error) {
      console.log(`   ❌ Failed: ${error.response?.data?.message || error.message}`);
    }
  }
}

testLogin().catch(console.error);