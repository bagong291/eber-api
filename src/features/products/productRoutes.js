const router             = require('express').Router();
const productController  = require('./productController');
const { authenticate }   = require('../../middlewares/auth');

/**
 * @openapi
 * /products:
 *   get:
 *     summary: List products
 */
router.get('/', productController.listProducts);
/**
 * @openapi
 * /products/{id}:
 */
router.get('/:id', productController.getProductById);

// Admin
router.post('/', authenticate, productController.createProduct);
router.put('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

module.exports = router;
