const fs = require('fs');
const path = require('path');

class FileUpload {
  static uploadBase64Image(imageObject, uploadDir = 'uploads') {
    if (!imageObject || !imageObject.data || !imageObject.extension || !imageObject.name) {
      return null;
    }

    // Validate extension
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    const ext = imageObject.extension.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error('Invalid image extension. Allowed: ' + allowedExtensions.join(', '));
    }

    // Create filename with timestamp to avoid conflicts
    const fileName = `${imageObject.name}_${Date.now()}.${ext}`;
    const uploadPath = path.join(__dirname, '../public', uploadDir);
    const filePath = path.join(uploadPath, fileName);

    // Ensure upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Save base64 data to file
    fs.writeFileSync(filePath, imageObject.data, 'base64');

    // Return relative path for DB
    return `${uploadDir}/${fileName}`;
  }

  static uploadBase64Pdf(pdfObject, uploadDir = 'uploads') {
    if (!pdfObject || !pdfObject.data || !pdfObject.extension || !pdfObject.name) {
      return null;
    }

    // Validate extension
    const allowedExtensions = ['pdf'];
    const ext = pdfObject.extension.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error('Invalid PDF extension. Allowed: ' + allowedExtensions.join(', '));
    }

    // Create filename with timestamp to avoid conflicts
    const fileName = `${pdfObject.name}_${Date.now()}.${ext}`;
    const uploadPath = path.join(__dirname, '../public', uploadDir);
    const filePath = path.join(uploadPath, fileName);

    // Ensure upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Save base64 data to file
    fs.writeFileSync(filePath, pdfObject.data, 'base64');

    // Return relative path for DB
    return `${uploadDir}/${fileName}`;
  }

  static deleteFile(filePath) {
    if (!filePath) return false;
    
    try {
      const fullPath = path.join(__dirname, '../public', filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
    return false;
  }
}

module.exports = FileUpload; 