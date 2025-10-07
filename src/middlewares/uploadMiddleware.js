const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true }); // pastikan folder ada
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const nameWithoutExt = path.basename(file.originalname, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-');
    const uniqueName = `${Date.now()}-${sanitizedName}${ext}`;
    cb(null, uniqueName);
  }
});

// File filter untuk validasi jenis file
const fileFilter = (req, file, cb) => {
  // Daftar MIME types yang diizinkan
  const allowedMimeTypes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Documents
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'text/csv',
    // Archives
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
    // Media
    'video/mp4', 'video/avi', 'video/quicktime', 'audio/mpeg', 'audio/wav'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
  }
};

// Konfigurasi multer dengan limits dan filter
const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // maksimal 10 files sekaligus
  }
});

// Export berbagai konfigurasi upload
const uploadModule = {
  single: (fieldName) => upload.single(fieldName),
  multiple: (fieldName, maxCount = 10) => upload.array(fieldName, maxCount),
  fields: (fields) => upload.fields(fields),
  upload // raw multer instance
};

// Untuk backward compatibility penuh - jika diimport langsung, return upload instance
module.exports = uploadModule;
module.exports.default = upload;
