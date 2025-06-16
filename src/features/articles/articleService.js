const ArticleRepository = require('./articleRepository');

class ArticleService {
  static listArticles() {
    return ArticleRepository.findAll();
  }

  static getArticleById(articleId) {
    return ArticleRepository.findById(articleId);
  }

  static createArticle(payload) {
    return ArticleRepository.createArticle(payload);
  }

  static updateArticle(articleId, payload) {
    return ArticleRepository.updateArticle(articleId, payload);
  }

  static deleteArticle(articleId) {
    return ArticleRepository.deleteArticle(articleId);
  }
}

module.exports = ArticleService;
