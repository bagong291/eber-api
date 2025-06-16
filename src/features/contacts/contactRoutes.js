const router              = require('express').Router();
const contactController   = require('./contactController');
const { authenticate }    = require('../../middlewares/auth');

/**
 * @openapi
 * /contacts:
 *   post:
 *     summary: Submit contact form
 */
router.post('/', contactController.createContact);

// Admin
router.get('/', authenticate, contactController.listContacts);
router.get('/:id', authenticate, contactController.getContactById);
router.delete('/:id', authenticate, contactController.deleteContact);

module.exports = router;
