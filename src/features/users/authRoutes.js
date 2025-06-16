const router            = require('express').Router();
const authController    = require('./authController');

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 */
router.post('/register', authController.register);
/**
 * @openapi
 * /auth/login:
 */
router.post('/login', authController.login);

module.exports = router;
