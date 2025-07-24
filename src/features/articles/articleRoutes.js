const router             = require('express').Router();
const articleController  = require('./articleController');
const { authenticate, authenticateOptional }   = require('../../middlewares/auth');

/**
 * @openapi
 * /articles:
 *   get:
 *     summary: List all articles
 */
router.get('/', authenticateOptional, articleController.listArticles);
/**
 * @openapi
 * /articles/{id}:
 */
router.get('/:id', authenticateOptional, articleController.getArticleById);

// Admin
router.post('/', authenticate, articleController.createArticle);
router.put('/:id', authenticate, articleController.updateArticle);
router.delete('/:id', authenticate, articleController.deleteArticle);

module.exports = router;
