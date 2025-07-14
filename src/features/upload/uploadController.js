const path = require('path');

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const fileName = req.file.filename.replace(/^\/+/, ''); // Remove any leading slashes
    const publicUrl = `/uploads/${fileName}`.replace(/\/+/g, '/'); // Ensure single slash

    res.status(200).json({
      status: 'success',
      url: publicUrl,
      filename: fileName
    });
  } catch (error) {
    next(error);
  }
};
