const router             = require('express').Router();
const careerController   = require('./careerController');
const { authenticate, authenticateOptional }   = require('../../middlewares/auth');
const uploadMiddleware = require('../../middlewares/uploadMiddleware');

/**
 * @openapi
 * /careers:
 *   get:
 *     summary: List careers
 */
router.get('/', authenticateOptional, careerController.listCareers);
/**
 * @openapi
 * /careers/{id}:
 */
router.get('/:id', authenticateOptional, careerController.getCareerById);

// Public endpoint for career application submission
/**
 * @openapi
 * /careers/apply:
 *   post:
 *     summary: Submit career application with resume
 */
router.post('/apply', uploadMiddleware.single('file'), careerController.submitCareerApplication);

// Admin routes
router.post('/', authenticate, careerController.createCareer);
router.put('/:id', authenticate, careerController.updateCareer);
router.delete('/:id', authenticate, careerController.deleteCareer);

module.exports = router;
