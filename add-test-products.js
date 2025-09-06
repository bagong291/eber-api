#!/usr/bin/env node

const Product = require('./src/features/products/Product');
const sequelize = require('./src/config/database');

async function createTestProducts() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Check if products already exist
    const existingProductCount = await Product.count();
    console.log(`📦 Current products in database: ${existingProductCount}`);

    if (existingProductCount === 0) {
      console.log('🚀 Creating test products...\n');

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

      for (const productData of testProducts) {
        try {
          const product = await Product.create(productData);
          console.log(`✅ Created product: ${product.code}`);
        } catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
            console.log(`ℹ️  Product ${productData.code} already exists`);
          } else {
            console.error(`❌ Failed to create product ${productData.code}:`, error.message);
          }
        }
      }

      console.log('\n🎉 Test products creation completed!');
    } else {
      console.log('ℹ️  Products already exist in database');
    }

    // Show final product count
    const finalProductCount = await Product.count();
    console.log(`\n📊 Total products in database: ${finalProductCount}`);

    if (finalProductCount > 0) {
      console.log('\n🏷️  Available products:');
      const products = await Product.findAll({
        attributes: ['code', 'type', 'application'],
        limit: 10
      });
      
      products.forEach(product => {
        console.log(`   - Code: ${product.code} | Type: ${product.type} | Application: ${product.application || 'N/A'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('\n🔚 Database connection closed');
  }
}

if (require.main === module) {
  createTestProducts();
}

module.exports = { createTestProducts };