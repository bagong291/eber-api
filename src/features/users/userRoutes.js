const router            = require('express').Router();
const userController    = require('./userController');
const { authenticate, authorizeAdmin } = require('../../middlewares/auth');

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List all users (admin only)
 */
router.get('/', authenticate, authorizeAdmin, userController.listUsers);
/**
 * @openapi
 * /users/{id}:
 */
router.get('/:id', authenticate, authorizeAdmin, userController.getUserById);
/**
 * @openapi
 * /users/{id}:
 *   put:
 */
router.put('/:id', authenticate, authorizeAdmin, userController.updateUser);
/**
 * @openapi
 * /users/{id}:
 */
router.delete('/:id', authenticate, authorizeAdmin, userController.deleteUser);

module.exports = router;
