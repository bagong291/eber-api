const router = require('express').Router();
const controller = require('./companyProfileController');
const { authenticate } = require('../../middlewares/auth');

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

module.exports = router;
