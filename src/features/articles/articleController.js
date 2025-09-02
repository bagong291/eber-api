const ArticleService = require('./articleService');

exports.listArticles = async (req, res, next) => {
  try {
    const { search, page = 1, pageSize, limit, ...filters } = req.query;
    const effectivePageSize = Number(limit) || Number(pageSize) || 10;
    // Only show active articles if not authenticated
    if (!req.user) {
      filters.status = true;
    }
    const items = await ArticleService.listArticles({ search, ...filters }, Number(page), effectivePageSize);
    res.json({status:"success",data:items});
  } catch (error) {
    next(error);
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const item = await ArticleService.getArticleById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Article not found' });
    // Only allow access to active articles if not authenticated
    if (!req.user && !item.status) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json({status:"success",data:item});
  } catch (error) {
    next(error);
  }
};

exports.createArticle = async (req, res, next) => {
  try {
    // Handle multi-language payload transformation
    let payload = { ...req.body };
    
    // If legacy format (title/body), transform to multi-lang
    if (payload.title && !payload.title_en && !payload.title_id) {
      payload.title_en = payload.title;
      payload.title_id = payload.title;
    }
    if (payload.body && !payload.body_en && !payload.body_id) {
      payload.body_en = payload.body;
      payload.body_id = payload.body;
    }
    
    // Ensure required multi-lang fields exist
    if (!payload.title_en || !payload.title_id) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Both English and Indonesian titles are required' 
      });
    }
    if (!payload.body_en || !payload.body_id) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Both English and Indonesian body content are required' 
      });
    }
    
    const newItem = await ArticleService.createArticle(payload);
    res.status(201).json({status:"success",data:newItem});
  } catch (error) {
    next(error);
  }
};

exports.updateArticle = async (req, res, next) => {
  try {
    // Handle multi-language payload transformation
    let payload = { ...req.body };
    
    // If legacy format (title/body), transform to multi-lang
    if (payload.title && !payload.title_en && !payload.title_id) {
      payload.title_en = payload.title;
      payload.title_id = payload.title;
    }
    if (payload.body && !payload.body_en && !payload.body_id) {
      payload.body_en = payload.body;
      payload.body_id = payload.body;
    }
    
    const updated = await ArticleService.updateArticle(req.params.id, payload);
    if (!updated) return res.status(404).json({ message: 'Article not found' });
    res.json({status:"success",data:updated});
  } catch (error) {
    next(error);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    await ArticleService.deleteArticle(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
