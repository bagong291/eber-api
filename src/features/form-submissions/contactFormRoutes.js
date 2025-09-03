const router = require('express').Router();
const formSubmissionController = require('./formSubmissionController');

/**
 * @openapi
 * /contact-form:
 *   post:
 *     summary: Submit contact form (public endpoint)
 *     tags: [Contact Form]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - message
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *                 example: "+1234567890"
 *               company:
 *                 type: string
 *                 description: User's company name (optional)
 *                 example: "Acme Corp"
 *               city:
 *                 type: string
 *                 description: User's city (optional)
 *                 example: "New York"
 *               message:
 *                 type: string
 *                 description: Contact message (will be used as subject if no subject provided)
 *                 example: "I'm interested in your products"
 *               subject:
 *                 type: string
 *                 description: Message subject (optional, defaults to "Contact Form Inquiry")
 *                 example: "Product Inquiry"
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Contact form submitted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 123
 *                     emailSent:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["First name is required", "Valid email address is required"]
 */

// Middleware to transform contact form data to form submission format
const transformContactFormData = (req, res, next) => {
  const { firstName, lastName, email, phone, company, city, message, subject } = req.body;
  
  // Transform the data to match the form submission format
  req.body = {
    firstName,
    lastName,
    email,
    phone,
    company,
    subject: subject || 'Contact Form Inquiry',
    message: message,
    formType: 'contact'
  };
  
  next();
};

// Contact form submission endpoint
router.post('/', transformContactFormData, formSubmissionController.submitForm);

module.exports = router;