const ArticleService = require('./articleService');

exports.listArticles = async (req, res, next) => {
  try {
    const items = await ArticleService.listArticles();
    res.json({status:"success",data:items});
  } catch (error) {
    next(error);
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const item = await ArticleService.getArticleById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Article not found' });
    res.json({status:"success",data:item});
  } catch (error) {
    next(error);
  }
};

exports.createArticle = async (req, res, next) => {
  try {
    const newItem = await ArticleService.createArticle(req.body);
    res.status(201).json({status:"success",data:newItem});
  } catch (error) {
    next(error);
  }
};

exports.updateArticle = async (req, res, next) => {
  try {
    const updated = await ArticleService.updateArticle(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Article not found' });
    res.json({status:"success",data:updated});
  } catch (error) {
    next(error);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    await ArticleService.deleteArticle(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
