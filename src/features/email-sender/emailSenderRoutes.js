const router = require('express').Router();
const emailSenderController = require('./emailSenderController');

/**
 * @openapi
 * /email/send/{type}:
 *   post:
 *     summary: Send email based on type (contact, custom-product)
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [contact, custom-product]
 */
router.post('/send/:type', emailSenderController.sendEmail);

module.exports = router;
