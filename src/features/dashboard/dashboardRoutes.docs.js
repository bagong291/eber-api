/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard statistics and recent data (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
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
 *                     stats:
 *                       type: object
 *                       properties:
 *                         heroBanners:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 5
 *                             active:
 *                               type: number
 *                               example: 3
 *                         articles:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 12
 *                             published:
 *                               type: number
 *                               example: 8
 *                             draft:
 *                               type: number
 *                               example: 4
 *                         careers:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 7
 *                             active:
 *                               type: number
 *                               example: 5
 *                             closed:
 *                               type: number
 *                               example: 2
 *                         products:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 15
 *                             active:
 *                               type: number
 *                               example: 12
 *                         contacts:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 23
 *                             unread:
 *                               type: number
 *                               example: 5
 *                         corporateEntities:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                               example: 3
 *                     recentArticles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: "Latest Company News"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-15T10:30:00Z"
 *                           status:
 *                             type: string
 *                             enum: [draft, published]
 *                             example: "published"
 *                     activeCareers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           position:
 *                             type: string
 *                             example: "Senior Developer"
 *                           location:
 *                             type: string
 *                             example: "Remote"
 *                           type:
 *                             type: string
 *                             enum: [full-time, part-time, contract, internship]
 *                             example: "full-time"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-10T09:15:00Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

module.exports = {};
