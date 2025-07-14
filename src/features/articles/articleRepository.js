const ArticleModel = require('./Article');

class ArticleRepository {
  static async findAll(filter = {}, page = 1, pageSize = 10) {
    const where = {};
    // Global search (title/content)
    if (filter.search) {
      where['$or'] = [
        { title: { $like: `%${filter.search}%` } },
        { content: { $like: `%${filter.search}%` } }
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

  static createArticle(data) {
    return ArticleModel.create(data);
  }

  static updateArticle(articleId, updates) {
    return ArticleModel.findByPk(articleId)
      .then(article => article && article.update(updates));
  }

  static deleteArticle(articleId) {
    return ArticleModel.findByPk(articleId)
      .then(article => article && article.destroy());
  }
}

module.exports = ArticleRepository;
