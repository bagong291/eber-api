const { Op } = require('sequelize');

class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async listProducts(filter = {}, page = 1, pageSize = 10) {
    const where = {};
    console.log('Filter:', filter);

    // 🔍 Global search by `code`, `name`, etc.
    if (filter.search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${filter.search}%` } },
        { name_en: { [Op.iLike]: `%${filter.search}%` } },
        { name_id: { [Op.iLike]: `%${filter.search}%` } },
        { performanceFeature: { [Op.iLike]: `%${filter.search}%` } },
        { performanceFeature_en: { [Op.iLike]: `%${filter.search}%` } },
        { performanceFeature_id: { [Op.iLike]: `%${filter.search}%` } },
        { type: { [Op.iLike]: `%${filter.search}%` } },
        { application: { [Op.iLike]: `%${filter.search}%` } },
        // tambahkan kolom lain jika perlu
      ];
    }

    // 🎯 Filter by code (opsional jika search tidak digunakan)
    if (filter.code) {
      where.code = { [Op.iLike]: `%${filter.code}%` };
    }

    // ✅ Filter by application with support for array (IN)
    if (filter.application) {
      if (Array.isArray(filter.application)) {
        where.application = { [Op.in]: filter.application };
      } else {
        where.application = { [Op.iLike]: `%${filter.application}%` };
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
