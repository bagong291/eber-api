/**
 * @swagger
 * /upload/file:
 *   post:
 *     summary: Upload a single file (No authentication required)
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (Images, Documents, Videos, etc. Max 50MB)
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: /uploads/1234567890-document.pdf
 *                     downloadUrl:
 *                       type: string
 *                       example: https://api.example.com/uploads/1234567890-document.pdf
 *                     filename:
 *                       type: string
 *                       example: 1234567890-document.pdf
 *                     originalname:
 *                       type: string
 *                       example: document.pdf
 *                     mimetype:
 *                       type: string
 *                       example: application/pdf
 *                     size:
 *                       type: integer
 *                       example: 1048576
 *                     extension:
 *                       type: string
 *                       example: .pdf
 *                     uploadedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T10:00:00.000Z
 *       400:
 *         description: No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       413:
 *         description: File too large
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error uploading file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /upload/files:
 *   post:
 *     summary: Upload multiple files (No authentication required)
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Multiple files to upload (Max 10 files, 50MB each)
 *     responses:
 *       200:
 *         description: Files uploaded successfully
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
 *                   example: Successfully uploaded 3 file(s)
 *                 data:
 *                   type: object
 *                   properties:
 *                     files:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           url:
 *                             type: string
 *                             example: /uploads/1234567890-document.pdf
 *                           downloadUrl:
 *                             type: string
 *                             example: https://api.example.com/uploads/1234567890-document.pdf
 *                           filename:
 *                             type: string
 *                             example: 1234567890-document.pdf
 *                           originalname:
 *                             type: string
 *                             example: document.pdf
 *                           mimetype:
 *                             type: string
 *                             example: application/pdf
 *                           size:
 *                             type: integer
 *                             example: 1048576
 *                           extension:
 *                             type: string
 *                             example: .pdf
 *                           uploadedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-01-01T10:00:00.000Z
 *                     totalFiles:
 *                       type: integer
 *                       example: 3
 *                     totalSize:
 *                       type: integer
 *                       example: 3145728
 *       400:
 *         description: No files uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       413:
 *         description: File too large
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error uploading file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload an image (No authentication required)
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (JPG, PNG, GIF, WEBP, SVG, max 50MB)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 url:
 *                   type: string
 *                   example: /uploads/1234567890-image.jpg
 *                 downloadUrl:
 *                   type: string
 *                   example: https://api.example.com/uploads/1234567890-image.jpg
 *                 filename:
 *                   type: string
 *                   example: 1234567890-image.jpg
 *       400:
 *         description: No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       413:
 *         description: File too large
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error uploading file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /upload/info/{filename}:
 *   get:
 *     summary: Get file information
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: The filename to get info for
 *         example: 1234567890-document.pdf
 *     responses:
 *       200:
 *         description: File information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: 1234567890-document.pdf
 *                     url:
 *                       type: string
 *                       example: /uploads/1234567890-document.pdf
 *                     downloadUrl:
 *                       type: string
 *                       example: https://api.example.com/uploads/1234567890-document.pdf
 *                     size:
 *                       type: integer
 *                       example: 1048576
 *                     extension:
 *                       type: string
 *                       example: .pdf
 *                     lastModified:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T10:00:00.000Z
 *                     created:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T10:00:00.000Z
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error retrieving file information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

module.exports = {};
