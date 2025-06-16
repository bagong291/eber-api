
const router            = require('express').Router();
const upload = require('../../middlewares/uploadMiddleware');
const uploadController = require('./uploadController');
const { authenticate } = require('../../middlewares/auth');

router.post('/image', authenticate, upload.single('image'), uploadController.uploadImage);

module.exports = router;
