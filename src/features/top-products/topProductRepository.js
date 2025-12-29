const TopProductModel = require('./TopProduct');
const ProductModel = require('../products/Product');

class TopProductRepository {
  async findAll() {
    return TopProductModel.findAll({
      include: [{
        model: ProductModel,
        as: 'product',
        attributes: ['id', 'code', 'application_en', 'application_id', 'type', 'status']
      }],
      order: [['rank', 'ASC']]
    });
  }

  async findById(id) {
    return TopProductModel.findByPk(id, {
      include: [{
        model: ProductModel,
        as: 'product'
      }]
    });
  }

  async findByProductId(productId) {
    return TopProductModel.findOne({
      where: { product_id: productId }
    });
  }

  async findByRank(rank) {
    return TopProductModel.findOne({
      where: { rank }
    });
  }

  async count() {
    return TopProductModel.count();
  }

  async create(data) {
    return TopProductModel.create(data);
  }

  async update(id, updates) {
    const topProduct = await this.findById(id);
    if (!topProduct) return null;
    return topProduct.update(updates);
  }

  async delete(id) {
    const topProduct = await this.findById(id);
    if (!topProduct) return null;
    return topProduct.destroy();
  }

  async deleteByProductId(productId) {
    return TopProductModel.destroy({
      where: { product_id: productId }
    });
  }

  // Reorder ranks after deletion
  async reorderRanks() {
    const topProducts = await TopProductModel.findAll({
      order: [['rank', 'ASC']]
    });
    
    for (let i = 0; i < topProducts.length; i++) {
      if (topProducts[i].rank !== i + 1) {
        await topProducts[i].update({ rank: i + 1 });
      }
    }
  }
}

module.exports = TopProductRepository;
