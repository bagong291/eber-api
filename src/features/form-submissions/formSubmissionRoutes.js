const router = require('express').Router();
const formSubmissionController = require('./formSubmissionController');
const { authenticate, authenticateOptional } = require('../../middlewares/auth');

/**
 * @openapi
 * /form-submissions/instant-access:
 *   post:
 *     summary: Submit instant access form (public endpoint)
 *     tags: [Form Submissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phone
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the user
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 description: Phone number
 *                 example: "+1234567890"
 *               company:
 *                 type: string
 *                 description: Company name (optional)
 *                 example: "Tech Corp"
 *               city:
 *                 type: string
 *                 description: City (optional)
 *                 example: "New York"
 *     responses:
 *       201:
 *         description: Form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Thank you! Check your email for instant access to our product catalog.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 123
 *                     emailSent:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: We've sent you an email with direct access to our complete product catalog.
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Full name is required", "Valid email address is required"]
 */
router.post('/instant-access', formSubmissionController.submitInstantAccessForm);

/**
 * @openapi
 * /form-submissions:
 *   post:
 *     summary: Submit a form (public endpoint)
 *     tags: [Form Submissions]
 */
router.post('/', formSubmissionController.submitForm);

/**
 * @openapi
 * /form-submissions/admin:
 *   get:
 *     summary: Get all form submissions (admin only)
 *     tags: [Form Submissions - Admin]
 */
router.get('/admin', authenticate, formSubmissionController.getSubmissions);

/**
 * @openapi
 * /form-submissions/admin/statistics:
 *   get:
 *     summary: Get form submission statistics (admin only)
 *     tags: [Form Submissions - Admin]
 */
router.get('/admin/statistics', authenticate, formSubmissionController.getStatistics);

/**
 * @openapi
 * /form-submissions/admin/email-service/check:
 *   get:
 *     summary: Check email service connection (admin only)
 *     tags: [Form Submissions - Admin]
 */
router.get('/admin/email-service/check', authenticate, formSubmissionController.checkEmailService);

/**
 * @openapi
 * /form-submissions/admin/{id}:
 *   get:
 *     summary: Get a specific form submission by ID (admin only)
 *     tags: [Form Submissions - Admin]
 */
router.get('/admin/:id', authenticate, formSubmissionController.getSubmissionById);

/**
 * @openapi
 * /form-submissions/admin/{id}/status:
 *   put:
 *     summary: Update form submission status (admin only)
 *     tags: [Form Submissions - Admin]
 */
router.put('/admin/:id/status', authenticate, formSubmissionController.updateSubmissionStatus);

/**
 * @openapi
 * /form-submissions/admin/{id}/resend-email:
 *   post:
 *     summary: Resend auto-response email (admin only)
 *     tags: [Form Submissions - Admin]
 */
router.post('/admin/:id/resend-email', authenticate, formSubmissionController.resendEmail);

/**
 * @openapi
 * /form-submissions/admin/{id}/send-response:
 *   post:
 *     summary: Send custom response email (admin only)
 *     tags: [Form Submissions - Admin]
 */
router.post('/admin/:id/send-response', authenticate, formSubmissionController.sendCustomResponse);

/**
 * @openapi
 * /form-submissions/admin/{id}:
 *   delete:
 *     summary: Delete a form submission (admin only)
 *     tags: [Form Submissions - Admin]
 */
router.delete('/admin/:id', authenticate, formSubmissionController.deleteSubmission);

module.exports = router;