const router = require('express').Router();
const dashboardController = require('./dashboardController');
const { authenticate } = require('../../middlewares/auth');

/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Get dashboard statistics and recent data
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
 *                             active:
 *                               type: number
 *                         articles:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                             published:
 *                               type: number
 *                             draft:
 *                               type: number
 *                         careers:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                             active:
 *                               type: number
 *                             closed:
 *                               type: number
 *                         products:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                             active:
 *                               type: number
 *                         contacts:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                             unread:
 *                               type: number
 *                         corporateEntities:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                     recentArticles:
 *                       type: array
 *                       items:
 *                         type: object
 *                     activeCareers:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticate, dashboardController.getDashboardStats);

module.exports = router; 