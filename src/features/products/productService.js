const { Op } = require('sequelize');

class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async listProducts(filter = {}, page = 1, pageSize = 10) {
    const where = {};
    console.log('Filter:', filter);

    // 🔍 Global search by `code`, `application`, etc.
    if (filter.search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${filter.search}%` } },
        { application_en: { [Op.iLike]: `%${filter.search}%` } },
        { application_id: { [Op.iLike]: `%${filter.search}%` } },
        { application: { [Op.iLike]: `%${filter.search}%` } }, // Legacy field
        { performanceFeature: { [Op.iLike]: `%${filter.search}%` } }, // Legacy field
        { performanceFeature_en: { [Op.iLike]: `%${filter.search}%` } },
        { performanceFeature_id: { [Op.iLike]: `%${filter.search}%` } },
        { type: { [Op.iLike]: `%${filter.search}%` } },
      ];
    }

    // 🎯 Filter by code (opsional jika search tidak digunakan)
    if (filter.code) {
      where.code = { [Op.iLike]: `%${filter.code}%` };
    }

    // ✅ Filter by application with support for array (IN) - check both multilingual and legacy fields
    if (filter.application) {
      if (Array.isArray(filter.application)) {
        where[Op.or] = [
          { application_en: { [Op.in]: filter.application } },
          { application: { [Op.in]: filter.application } } // Legacy field
        ];
      } else {
        where[Op.or] = [
          { application_en: { [Op.iLike]: `%${filter.application}%` } },
          { application: { [Op.iLike]: `%${filter.application}%` } } // Legacy field
        ];
      }
    }

    // ✅ Filter by type with support for array (IN)
    if (filter.type) {
      if (Array.isArray(filter.type)) {
        where.type = { [Op.in]: filter.type };
      } else {
        where.type = { [Op.iLike]: `%${filter.type}%` };
      }
    }

    // ✅ Filter by status
    if (filter.status) {
      where.status = filter.status === 'true' ? true : false;
    }

    const limit = Math.min(pageSize, 100);
    const offset = (page - 1) * limit;

    // Ambil daftar unique application & type
    const applications = await this.productRepository.findDistinctApplication();
    const types = await this.productRepository.findDistinctType();

    const [data, total] = await Promise.all([
      this.productRepository.findAll({ where, limit, offset }),
      this.productRepository.count({ where }),
    ]);

    return {
      data,
      filter_feature:{types,applications},
      meta:{page,total,pageSize: limit}
    };
  }

  async getProductById(productId) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Produk tidak ditemukan');
    }
    return product;
  }

  async createProduct(payload) {
    return this.productRepository.createProduct(payload);
  }

  async updateProduct(productId, payload) {
    const updated = await this.productRepository.updateProduct(productId, payload);
    if (!updated) {
      throw new Error('Produk tidak ditemukan untuk diperbarui');
    }
    return updated;
  }

  async deleteProduct(productId) {
    const deleted = await this.productRepository.deleteProduct(productId);
    if (!deleted) {
      throw new Error('Produk tidak ditemukan untuk dihapus');
    }
    return true;
  }
}

module.exports = ProductService;
