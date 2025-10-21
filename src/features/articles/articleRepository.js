const { Op } = require('sequelize');
const ArticleModel = require('./Article');

class ArticleRepository {
  static async findAll(filter = {}, page = 1, pageSize = 10) {
    const where = {};
    // Global search (title/body/author)
    if (filter.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${filter.search}%` } },
        { body: { [Op.iLike]: `%${filter.search}%` } },
        { author: { [Op.iLike]: `%${filter.search}%` } }
      ];
    }
    // Add other filters (e.g., author, category, etc.)
    Object.keys(filter).forEach(key => {
      if (key !== 'search') {
        where[key] = filter[key];
      }
    });
    const limit = Math.min(Number(pageSize) || 10, 100);
    const offset = (Number(page) - 1) * limit;
    const [data, total] = await Promise.all([
      ArticleModel.findAll({ where, order: [['created_at', 'DESC']], limit, offset }),
      ArticleModel.count({ where })
    ]);
    return {
      data,
      meta: { page: Number(page), pageSize: limit, total }
    };
  }

  static findById(articleId) {
    return ArticleModel.findByPk(articleId);
  }

  static async createArticle(data) {
    // If createdAt is provided, we need to handle it specially
    if (data.createdAt) {
      const article = await ArticleModel.create(data);
      // Update the createdAt after creation
      await article.update({ createdAt: data.createdAt }, { silent: true });
      // Reload to get the updated values
      await article.reload();
      return article;
    }
    return ArticleModel.create(data);
  }

  static async updateArticle(articleId, updates) {
    const article = await ArticleModel.findByPk(articleId);
    if (!article) return null;
    
    // If createdAt is in the updates, use silent: true to allow timestamp override
    if (updates.createdAt) {
      await article.update(updates, { silent: true });
      await article.reload();
      return article;
    }
    
    return article.update(updates);
  }

  static deleteArticle(articleId) {
    return ArticleModel.findByPk(articleId)
      .then(article => article && article.destroy());
  }
}

module.exports = ArticleRepository;
