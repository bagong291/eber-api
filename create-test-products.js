#!/usr/bin/env node

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3022';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

async function loginAdmin() {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
      username: 'admin',
      password: ADMIN_PASSWORD
    });
    return response.data.token;
  } catch (error) {
    console.error('Failed to login as admin:', error.response?.data || error.message);
    throw error;
  }
}

async function createProducts(token) {
  const testProducts = [
    {
      code: 'ETA_01',
      type: 'Industrial',
      application_en: 'Manufacturing and industrial processes',
      application_id: 'Proses manufaktur dan industri',
      application: 'Manufacturing and industrial processes',
      performanceFeature_en: 'High efficiency, durable construction, optimal performance in demanding environments',
      performanceFeature_id: 'Efisiensi tinggi, konstruksi tahan lama, performa optimal di lingkungan yang menuntut',
      performanceFeature: 'High efficiency, durable construction, optimal performance in demanding environments',
      status: true
    },
    {
      code: 'EBA 1261-70 T 3',
      type: 'Commercial',
      application_en: 'Commercial and residential applications',
      application_id: 'Aplikasi komersial dan residensial',
      application: 'Commercial and residential applications',
      performanceFeature_en: 'Energy efficient, compact design, reliable operation, easy maintenance',
      performanceFeature_id: 'Hemat energi, desain kompak, operasi yang andal, perawatan mudah',
      performanceFeature: 'Energy efficient, compact design, reliable operation, easy maintenance',
      status: true
    },
    {
      code: 'ETB_05',
      type: 'Heavy Duty',
      application_en: 'Heavy duty industrial applications',
      application_id: 'Aplikasi industri tugas berat',
      application: 'Heavy duty industrial applications',
      performanceFeature_en: 'Maximum durability, high load capacity, extended service life',
      performanceFeature_id: 'Daya tahan maksimum, kapasitas beban tinggi, umur layanan diperpanjang',
      performanceFeature: 'Maximum durability, high load capacity, extended service life',
      status: true
    },
    {
      code: 'ETC_10',
      type: 'Precision',
      application_en: 'Precision manufacturing and laboratory use',
      application_id: 'Manufaktur presisi dan penggunaan laboratorium',
      application: 'Precision manufacturing and laboratory use',
      performanceFeature_en: 'Ultra-precise operation, minimal vibration, temperature controlled',
      performanceFeature_id: 'Operasi ultra-presisi, getaran minimal, dikontrol suhu',
      performanceFeature: 'Ultra-precise operation, minimal vibration, temperature controlled',
      status: true
    },
    {
      code: 'ETD_15',
      type: 'Environmental',
      application_en: 'Environmental monitoring and control systems',
      application_id: 'Sistem pemantauan dan kontrol lingkungan',
      application: 'Environmental monitoring and control systems',
      performanceFeature_en: 'Weather resistant, low power consumption, remote monitoring capability',
      performanceFeature_id: 'Tahan cuaca, konsumsi daya rendah, kemampuan pemantauan jarak jauh',
      performanceFeature: 'Weather resistant, low power consumption, remote monitoring capability',
      status: true
    }
  ];

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  console.log('🚀 Creating test products...\n');
  
  for (const product of testProducts) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/products`, product, config);
      console.log(`✅ Created product: ${product.code}`);
    } catch (error) {
      if (error.response?.status === 409 || error.response?.data?.message?.includes('exists')) {
        console.log(`ℹ️  Product ${product.code} already exists`);
      } else {
        console.error(`❌ Failed to create product ${product.code}:`, error.response?.data || error.message);
      }
    }
  }
}

async function checkProducts() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/products`);
    const productCount = response.data?.data?.data?.length || 0;
    console.log(`\n📦 Total products in database: ${productCount}`);
    
    if (productCount > 0) {
      console.log('🏷️  Available products:');
      response.data.data.data.slice(0, 5).forEach(product => {
        console.log(`   - Code: ${product.code} | Type: ${product.type}`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to check products:', error.message);
  }
}

async function main() {
  try {
    console.log('🔐 Logging in as admin...');
    const token = await loginAdmin();
    console.log('✅ Admin login successful\n');
    
    await createProducts(token);
    await checkProducts();
    
    console.log('\n🎉 Test products setup completed!');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };