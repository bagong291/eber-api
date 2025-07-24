const router = require('express').Router();
const controller = require('./adminCompanyProfileController');
const { authenticate, authenticateOptional } = require('../../middlewares/auth');

router.get('/', authenticateOptional, controller.list);
router.get('/:id', authenticateOptional, controller.get);
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

module.exports = router; 