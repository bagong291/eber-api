const router            = require('express').Router();
const uploadMiddleware = require('../../middlewares/uploadMiddleware');
const uploadController = require('./uploadController');

// Upload single file (any type) - NO AUTH REQUIRED
router.post('/file', uploadMiddleware.single('file'), uploadController.uploadFile);

// Upload multiple files - NO AUTH REQUIRED
router.post('/files', uploadMiddleware.multiple('files', 10), uploadController.uploadMultipleFiles);

// Upload single image (backward compatibility) - NO AUTH REQUIRED
router.post('/image', uploadMiddleware.single('image'), uploadController.uploadImage);

// Get file info - NO AUTH REQUIRED
router.get('/info/:filename', uploadController.getFileInfo);

module.exports = router;
