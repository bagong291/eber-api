const { Op, fn, col } = require('sequelize');
const ProductModel = require('./Product');

class ProductRepository {
  async findAll({ where = {}, limit, offset } = {}) {
    return ProductModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
  }

  async count({ where = {} } = {}) {
    return ProductModel.count({ where });
  }

  async findById(productId) {
    return ProductModel.findByPk(productId);
  }

  async findByCode(productCode) {
    return ProductModel.findOne({
      where: { code: productCode }
    });
  }

  async findDistinctType() {
    const result = await ProductModel.findAll({
      attributes: [[fn('DISTINCT', col('type')), 'type']],
      where: { type: { [Op.ne]: null } },
      raw: true,
    });

    return result.map(item => item.type);
  }

  async findDistinctApplication() {
    const result = await ProductModel.findAll({
      attributes: [[fn('DISTINCT', col('application')), 'application']],
      where: { application: { [Op.ne]: null } },
      raw: true,
    });

    return result.map(item => item.application);
  }

  async createProduct(data) {
    return ProductModel.create(data);
  }

  async updateProduct(productId, updates) {
    const product = await this.findById(productId);
    if (!product) return null;
    return product.update(updates);
  }

  async deleteProduct(productId) {
    const product = await this.findById(productId);
    if (!product) return null;
    return product.destroy();
  }
}

module.exports = ProductRepository;
