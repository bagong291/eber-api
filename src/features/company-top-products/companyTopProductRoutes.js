const router = require('express').Router();
const controller = require('./companyTopProductController');
const { authenticate } = require('../../middlewares/auth');

// Public routes
router.get('/', controller.listAll);
router.get('/company/:companyId', controller.getByCompanyId);

// Admin routes
router.post('/', authenticate, controller.addTopProduct);
router.put('/:id', authenticate, controller.updateRank);
router.delete('/:id', authenticate, controller.removeTopProduct);

module.exports = router;
