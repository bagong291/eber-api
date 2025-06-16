const router             = require('express').Router();
const careerController   = require('./careerController');
const { authenticate }   = require('../../middlewares/auth');

/**
 * @openapi
 * /careers:
 *   get:
 *     summary: List careers
 */
router.get('/', careerController.listCareers);
/**
 * @openapi
 * /careers/{id}:
 */
router.get('/:id', careerController.getCareerById);

// Admin
router.post('/', authenticate, careerController.createCareer);
router.put('/:id', authenticate, careerController.updateCareer);
router.delete('/:id', authenticate, careerController.deleteCareer);

module.exports = router;
