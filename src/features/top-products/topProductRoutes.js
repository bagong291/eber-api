const router = require('express').Router();
const topProductController = require('./topProductController');
const { authenticate } = require('../../middlewares/auth');

// Public route - get top products
router.get('/', topProductController.listTopProducts);
router.get('/:id', topProductController.getTopProductById);

// Admin routes - manage top products
router.post('/', authenticate, topProductController.addTopProduct);
router.put('/:id', authenticate, topProductController.updateTopProductRank);
router.delete('/:id', authenticate, topProductController.removeTopProduct);

module.exports = router;
