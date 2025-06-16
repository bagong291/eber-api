const router           = require('express').Router();
const homeController   = require('./homeController');
const { authenticate } = require('../../middlewares/auth');

/**
 * @openapi
 * /home:
 *   get:
 *     summary: List home content
 */
router.get('/', homeController.listHome);
/**
 * @openapi
 * /home/{id}:
 */
router.get('/:id', homeController.getHomeById);

// Admin
router.post('/', authenticate, homeController.createHome);
router.put('/:id', authenticate, homeController.updateHome);
router.delete('/:id', authenticate, homeController.deleteHome);

module.exports = router;
