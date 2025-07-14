const ArticleRepository = require('./articleRepository');
const FileUpload = require('../../utils/fileUpload');

class ArticleService {
  static listArticles(filter = {}, page = 1, pageSize = 10) {
    return ArticleRepository.findAll(filter, page, pageSize);
  }

  static getArticleById(articleId) {
    return ArticleRepository.findById(articleId);
  }

  static async createArticle(payload) {
    console.log('Original payload:', JSON.stringify(payload, null, 2));
    
    // Handle image upload
    if (payload.image) {
      const imagePath = FileUpload.uploadBase64Image(payload.image);
      if (imagePath) {
        payload.image = imagePath;
        console.log('Image saved:', imagePath);
      } else {
        console.log('No valid image object found in payload');
      }
    }

    // Handle PDF upload
    if (payload.pdf) {
      const pdfPath = FileUpload.uploadBase64Pdf(payload.pdf);
      if (pdfPath) {
        payload.pdf = pdfPath;
        console.log('PDF saved:', pdfPath);
      } else {
        console.log('No valid PDF object found in payload');
      }
    }
    
    const result = await ArticleRepository.createArticle(payload);
    console.log('Article created:', JSON.stringify(result, null, 2));
    return result;
  }

  static async updateArticle(articleId, payload) {
    console.log('Update payload:', JSON.stringify(payload, null, 2));
    
    // Get existing article to handle old image deletion
    const existingArticle = await ArticleRepository.findById(articleId);
    
    // Handle image upload if present
    if (payload.image) {
      const imagePath = FileUpload.uploadBase64Image(payload.image);
      if (imagePath) {
        // Delete old image if it exists
        if (existingArticle && existingArticle.image) {
          FileUpload.deleteFile(existingArticle.image);
        }
        payload.image = imagePath;
        console.log('Image saved:', imagePath);
      } else {
        console.log('No valid image object found in update payload');
      }
    }

    // Handle PDF upload if present
    if (payload.pdf) {
      const pdfPath = FileUpload.uploadBase64Pdf(payload.pdf);
      if (pdfPath) {
        // Delete old PDF if it exists
        if (existingArticle && existingArticle.pdf) {
          FileUpload.deleteFile(existingArticle.pdf);
        }
        payload.pdf = pdfPath;
        console.log('PDF saved:', pdfPath);
      } else {
        console.log('No valid PDF object found in update payload');
      }
    }
    
    const result = await ArticleRepository.updateArticle(articleId, payload);
    console.log('Article updated:', JSON.stringify(result, null, 2));
    return result;
  }

  static async deleteArticle(articleId) {
    // Get article to delete associated image
    const article = await ArticleRepository.findById(articleId);
    if (article && article.image) {
      FileUpload.deleteFile(article.image);
    }
    // Delete associated PDF if it exists
    if (article && article.pdf) {
      FileUpload.deleteFile(article.pdf);
    }
    
    return ArticleRepository.deleteArticle(articleId);
  }
}

module.exports = ArticleService;
