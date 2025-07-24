/**
 * @swagger
 * /corporate:
 *   get:
 *     summary: Get all company profiles (Public)
 *     tags: [Company Profile]
 *     responses:
 *       200:
 *         description: List of company profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CompanyProfile'
 *   post:
 *     summary: Create a new company profile (Admin only)
 *     tags: [Company Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyProfile'
 *     responses:
 *       201:
 *         description: Company profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/CompanyProfile'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *
 * /corporate/{id}:
 *   get:
 *     summary: Get company profile by ID (Public)
 *     tags: [Company Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company Profile ID
 *     responses:
 *       200:
 *         description: Company profile details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/CompanyProfile'
 *       404:
 *         description: Company profile not found
 *
 *   put:
 *     summary: Update company profile (Admin only)
 *     tags: [Company Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company Profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyProfile'
 *     responses:
 *       200:
 *         description: Company profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/CompanyProfile'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company profile not found
 *
 *   delete:
 *     summary: Delete company profile (Admin only)
 *     tags: [Company Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company Profile ID
 *     responses:
 *       204:
 *         description: Company profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company profile not found
 */

module.exports = {};
