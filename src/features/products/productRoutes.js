const router             = require('express').Router();
const productController  = require('./productController');
const { authenticate, authenticateOptional }   = require('../../middlewares/auth');

/**
 * @openapi
 * /products:
 *   get:
 *     summary: List products
 */
router.get('/', authenticateOptional, productController.listProducts);
/**
 * @openapi
 * /products/{id}:
 */
router.get('/:id', authenticateOptional, productController.getProductById);

// Admin
router.post('/', authenticate, productController.createProduct);
router.put('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

module.exports = router;
