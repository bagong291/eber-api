const ProductService = require('./productService');
const ProductRepository = require('./productRepository');

const pr = new ProductRepository();
const ps = new ProductService(pr)
exports.listProducts = async (req, res, next) => {
  try {
    // Use query parameters instead of body for GET requests
    const filter = {
      search: req.query.search,
      code: req.query.code,
      // Handle comma-separated values for arrays
      application: req.query.application ? 
        (typeof req.query.application === 'string' ? 
          req.query.application.split(',').map(s => s.trim()).filter(Boolean) : 
          (Array.isArray(req.query.application) ? req.query.application : [req.query.application])
        ) : undefined,
      type: req.query.type ? 
        (typeof req.query.type === 'string' ? 
          req.query.type.split(',').map(s => s.trim()).filter(Boolean) : 
          (Array.isArray(req.query.type) ? req.query.type : [req.query.type])
        ) : undefined,
      segment: req.query.segment ? 
        (typeof req.query.segment === 'string' ? 
          req.query.segment.split(',').map(s => s.trim()).filter(Boolean) : 
          (Array.isArray(req.query.segment) ? req.query.segment : [req.query.segment])
        ) : undefined,
      grp_sbu: req.query.grp_sbu ? 
        (typeof req.query.grp_sbu === 'string' ? 
          req.query.grp_sbu.split(',').map(s => s.trim()).filter(Boolean) : 
          (Array.isArray(req.query.grp_sbu) ? req.query.grp_sbu : [req.query.grp_sbu])
        ) : undefined,
      sbu_name: req.query.sbu_name ? 
        (typeof req.query.sbu_name === 'string' ? 
          req.query.sbu_name.split(',').map(s => s.trim()).filter(Boolean) : 
          (Array.isArray(req.query.sbu_name) ? req.query.sbu_name : [req.query.sbu_name])
        ) : undefined,
      grp_name: req.query.grp_name ? 
        (typeof req.query.grp_name === 'string' ? 
          req.query.grp_name.split(',').map(s => s.trim()).filter(Boolean) : 
          (Array.isArray(req.query.grp_name) ? req.query.grp_name : [req.query.grp_name])
        ) : undefined,
      status: req.query.status
    }
    // Only show active products if not authenticated
    if (!req.user) {
      filter.status = true;
    }
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const items = await ps.listProducts(filter, page, pageSize);
    res.json({status:"success",data:items});
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const item = await ps.getProductById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Product not found' });
    // Only allow access to active products if not authenticated
    if (!req.user && !item.status) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const newItem = await ps.createProduct(req.body);
    res.status(201).json({status:"success",data:newItem});;
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updated = await ps.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({status:"success",data:updated});
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await ps.deleteProduct(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
