/**
 * @openapi
 * components:
 *   schemas:
 *     FormSubmission:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - subject
 *         - message
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         firstName:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: First name of the person submitting the form
 *           example: "John"
 *         lastName:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Last name of the person submitting the form
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the person submitting the form
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           maxLength: 20
 *           description: Phone number (optional)
 *           example: "+1-555-123-4567"
 *         company:
 *           type: string
 *           maxLength: 200
 *           description: Company name (optional)
 *           example: "Acme Corporation"
 *         subject:
 *           type: string
 *           minLength: 5
 *           maxLength: 200
 *           description: Subject of the inquiry
 *           example: "Product inquiry about XYZ"
 *         message:
 *           type: string
 *           minLength: 10
 *           maxLength: 2000
 *           description: Message content
 *           example: "I would like to know more about your products and pricing."
 *         formType:
 *           type: string
 *           enum: [inquiry, quote_request, contact, partnership, support]
 *           default: inquiry
 *           description: Type of form submission
 *         status:
 *           type: string
 *           enum: [pending, responded, resolved, spam]
 *           default: pending
 *           description: Status of the submission
 *         emailSent:
 *           type: boolean
 *           description: Whether email notification was sent
 *         emailSentAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when email was sent
 *         ipAddress:
 *           type: string
 *           description: IP address of the submitter
 *         userAgent:
 *           type: string
 *           description: User agent string of the submitter
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     FormSubmissionRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - subject
 *         - message
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "John"
 *         lastName:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           maxLength: 20
 *           example: "+1-555-123-4567"
 *         company:
 *           type: string
 *           maxLength: 200
 *           example: "Acme Corporation"
 *         subject:
 *           type: string
 *           minLength: 5
 *           maxLength: 200
 *           example: "Product inquiry about XYZ"
 *         message:
 *           type: string
 *           minLength: 10
 *           maxLength: 2000
 *           example: "I would like to know more about your products and pricing."
 *         formType:
 *           type: string
 *           enum: [inquiry, quote_request, contact, partnership, support]
 *           default: inquiry
 *     
 *     FormSubmissionResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Form submitted successfully"
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 123
 *             emailSent:
 *               type: boolean
 *               example: true
 *         warning:
 *           type: string
 *           example: "Form was saved but email notification failed"
 *         emailError:
 *           type: string
 *           example: "SMTP connection failed"
 *     
 *     FormSubmissionList:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         data:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FormSubmission'
 *             totalItems:
 *               type: integer
 *               example: 50
 *             currentPage:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 5
 *             pageSize:
 *               type: integer
 *               example: 10
 *     
 *     FormSubmissionStatistics:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         data:
 *           type: object
 *           properties:
 *             totalSubmissions:
 *               type: integer
 *               example: 150
 *             recentSubmissions:
 *               type: integer
 *               example: 12
 *             byType:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   formType:
 *                     type: string
 *                   count:
 *                     type: integer
 *             byStatus:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                   count:
 *                     type: integer
 *     
 *     StatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, responded, resolved, spam]
 *           example: "responded"
 *     
 *     CustomResponse:
 *       type: object
 *       required:
 *         - subject
 *         - message
 *       properties:
 *         subject:
 *           type: string
 *           example: "Re: Your inquiry about our products"
 *         message:
 *           type: string
 *           example: "Thank you for your interest. Here is the information you requested..."
 * 
 * /form-submissions:
 *   post:
 *     summary: Submit a form
 *     description: Public endpoint for submitting forms. Saves data to database and sends email notifications.
 *     tags: [Form Submissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FormSubmissionRequest'
 *     responses:
 *       201:
 *         description: Form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormSubmissionResponse'
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
 *                   example: ["First name must be at least 2 characters long", "Valid email address is required"]
 *       500:
 *         description: Server error
 * 
 * /form-submissions/admin:
 *   get:
 *     summary: Get all form submissions
 *     description: Admin endpoint to retrieve form submissions with filtering and pagination
 *     tags: [Form Submissions - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search across multiple fields
 *       - in: query
 *         name: formType
 *         schema:
 *           type: string
 *           enum: [inquiry, quote_request, contact, partnership, support]
 *         description: Filter by form type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, responded, resolved, spam]
 *         description: Filter by status
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by email (partial match)
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Filter by company (partial match)
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter submissions from this date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter submissions to this date
 *     responses:
 *       200:
 *         description: List of form submissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormSubmissionList'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 * 
 * /form-submissions/admin/statistics:
 *   get:
 *     summary: Get form submission statistics
 *     description: Admin endpoint to get statistics about form submissions
 *     tags: [Form Submissions - Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Form submission statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormSubmissionStatistics'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 * 
 * /form-submissions/admin/email-service/check:
 *   get:
 *     summary: Check email service connection
 *     description: Admin endpoint to verify SMTP connection status
 *     tags: [Form Submissions - Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email service status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     emailServiceConnected:
 *                       type: boolean
 *                       example: true
 *                     error:
 *                       type: string
 *                       example: "SMTP connection failed"
 *       401:
 *         description: Unauthorized
 * 
 * /form-submissions/admin/{id}:
 *   get:
 *     summary: Get form submission by ID
 *     description: Admin endpoint to get a specific form submission
 *     tags: [Form Submissions - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Form submission ID
 *     responses:
 *       200:
 *         description: Form submission details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/FormSubmission'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form submission not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete form submission
 *     description: Admin endpoint to delete a form submission
 *     tags: [Form Submissions - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Form submission ID
 *     responses:
 *       204:
 *         description: Form submission deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form submission not found
 *       500:
 *         description: Server error
 * 
 * /form-submissions/admin/{id}/status:
 *   put:
 *     summary: Update form submission status
 *     description: Admin endpoint to update the status of a form submission
 *     tags: [Form Submissions - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Form submission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdate'
 *     responses:
 *       200:
 *         description: Status updated successfully
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
 *                   example: "Submission status updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/FormSubmission'
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form submission not found
 *       500:
 *         description: Server error
 * 
 * /form-submissions/admin/{id}/resend-email:
 *   post:
 *     summary: Resend auto-response email
 *     description: Admin endpoint to resend the auto-response email to the form submitter
 *     tags: [Form Submissions - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Form submission ID
 *     responses:
 *       200:
 *         description: Email resent successfully
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
 *                   example: "Email resent successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     emailSent:
 *                       type: boolean
 *                       example: true
 *                     messageId:
 *                       type: string
 *                       example: "abc123@smtp.gmail.com"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form submission not found
 *       500:
 *         description: Server error
 * 
 * /form-submissions/admin/{id}/send-response:
 *   post:
 *     summary: Send custom response email
 *     description: Admin endpoint to send a custom response email to the form submitter
 *     tags: [Form Submissions - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Form submission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomResponse'
 *     responses:
 *       200:
 *         description: Custom response sent successfully
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
 *                   example: "Custom response sent successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     emailSent:
 *                       type: boolean
 *                       example: true
 *                     messageId:
 *                       type: string
 *                       example: "abc123@smtp.gmail.com"
 *       400:
 *         description: Missing subject or message
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form submission not found
 *       500:
 *         description: Server error
 */