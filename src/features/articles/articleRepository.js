const ArticleModel = require('./Article');

class ArticleRepository {
  static findAll() {
    return ArticleModel.findAll({ order: [['created_at', 'DESC']] });
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
