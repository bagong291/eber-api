const router = require('express').Router();
const certificateController = require('./certificateController');
const { authenticate, authenticateOptional } = require('../../middlewares/auth');

/**
 * @openapi
 * /certificates:
 *   get:
 *     summary: List all certificates
 *     tags: [Certificates]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by certificate name
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: Filter by active/inactive status
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
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of certificates
 */
router.get('/', authenticateOptional, certificateController.listCertificates);

/**
 * @openapi
 * /certificates/{id}:
 *   get:
 *     summary: Get certificate by ID
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Certificate ID
 *     responses:
 *       200:
 *         description: Certificate details
 *       404:
 *         description: Certificate not found
 */
router.get('/:id', authenticateOptional, certificateController.getCertificateById);

// Admin routes
router.post('/', authenticate, certificateController.createCertificate);
router.put('/:id', authenticate, certificateController.updateCertificate);
router.delete('/:id', authenticate, certificateController.deleteCertificate);

module.exports = router;
