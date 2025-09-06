const Product = require('../features/products/Product');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if products already exist
      const existingProducts = await Product.count();
      
      if (existingProducts === 0) {
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
            status: true,
            createdAt: new Date(),
            updatedAt: new Date()
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
            status: true,
            createdAt: new Date(),
            updatedAt: new Date()
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
            status: true,
            createdAt: new Date(),
            updatedAt: new Date()
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
            status: true,
            createdAt: new Date(),
            updatedAt: new Date()
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
            status: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];

        await Product.bulkCreate(testProducts);
        console.log('✅ Test products created successfully');
      } else {
        console.log('ℹ️  Products already exist in database');
      }
    } catch (error) {
      console.error('❌ Error seeding test products:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await Product.destroy({ where: {} });
  }
};