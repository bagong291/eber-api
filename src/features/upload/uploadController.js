const path = require('path');
const fs = require('fs');

// Helper function untuk mendapatkan informasi file
const getFileInfo = (file) => {
  const stats = fs.statSync(file.path);
  return {
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: stats.size,
    extension: path.extname(file.originalname).toLowerCase(),
    uploadedAt: new Date().toISOString()
  };
};

// Helper function untuk membuat response URL
const createFileResponse = (file, req) => {
  const fileName = file.filename.replace(/^\/*/, ''); // Remove any leading slashes
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const host = req.get('host');
  const publicUrl = `/uploads/${fileName}`.replace(/\/+/g, '/'); // Ensure single slash
  const downloadUrl = `${protocol}://${host}${publicUrl}`;
  
  return {
    status: 'success',
    data: {
      url: publicUrl, // URL relatif untuk internal use
      downloadUrl: downloadUrl, // URL lengkap untuk download
      filename: fileName,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      extension: path.extname(file.originalname).toLowerCase(),
      uploadedAt: new Date().toISOString()
    }
  };
};

// Upload single file (images, documents, dll)
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'No file uploaded. Please select a file to upload.' 
      });
    }

    const fileInfo = getFileInfo(req.file);
    const response = createFileResponse({ ...req.file, ...fileInfo }, req);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Upload multiple files
exports.uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'No files uploaded. Please select files to upload.' 
      });
    }

    const filesInfo = req.files.map(file => {
      const fileInfo = getFileInfo(file);
      return createFileResponse({ ...file, ...fileInfo }, req).data;
    });

    res.status(200).json({
      status: 'success',
      message: `Successfully uploaded ${filesInfo.length} file(s)`,
      data: {
        files: filesInfo,
        totalFiles: filesInfo.length,
        totalSize: filesInfo.reduce((total, file) => total + file.size, 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Backward compatibility - masih support upload image
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No image uploaded' });
    }

    // Validasi apakah file adalah gambar
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'File must be an image' 
      });
    }

    const fileInfo = getFileInfo(req.file);
    const response = createFileResponse({ ...req.file, ...fileInfo }, req);

    res.status(200).json({
      status: 'success',
      url: response.data.url,
      downloadUrl: response.data.downloadUrl,
      filename: response.data.filename
    });
  } catch (error) {
    next(error);
  }
};

// Get file info (untuk melihat detail file yang sudah diupload)
exports.getFileInfo = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }

    const stats = fs.statSync(filePath);
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.get('host');
    const publicUrl = `/uploads/${filename}`.replace(/\/+/g, '/');
    const downloadUrl = `${protocol}://${host}${publicUrl}`;

    res.status(200).json({
      status: 'success',
      data: {
        filename: filename,
        url: publicUrl,
        downloadUrl: downloadUrl,
        size: stats.size,
        extension: path.extname(filename).toLowerCase(),
        lastModified: stats.mtime,
        created: stats.birthtime
      }
    });
  } catch (error) {
    next(error);
  }
};
