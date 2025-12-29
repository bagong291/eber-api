const TopProductService = require('./topProductService');
const TopProductRepository = require('./topProductRepository');

const repository = new TopProductRepository();
const service = new TopProductService(repository);

exports.listTopProducts = async (req, res, next) => {
  try {
    const topProducts = await service.listTopProducts();
    res.json({ status: 'success', data: topProducts });
  } catch (error) {
    next(error);
  }
};

exports.getTopProductById = async (req, res, next) => {
  try {
    const topProduct = await service.getTopProductById(req.params.id);
    res.json({ status: 'success', data: topProduct });
  } catch (error) {
    next(error);
  }
};

exports.addTopProduct = async (req, res, next) => {
  try {
    const { product_id, rank } = req.body;
    
    if (!product_id || !rank) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'product_id and rank are required' 
      });
    }

    const topProduct = await service.addTopProduct(product_id, rank);
    res.status(201).json({ status: 'success', data: topProduct });
  } catch (error) {
    if (error.message.includes('Maximum') || 
        error.message.includes('already') || 
        error.message.includes('taken')) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

exports.updateTopProductRank = async (req, res, next) => {
  try {
    const { rank } = req.body;
    
    if (!rank) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'rank is required' 
      });
    }

    const topProduct = await service.updateTopProductRank(req.params.id, rank);
    res.json({ status: 'success', data: topProduct });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

exports.removeTopProduct = async (req, res, next) => {
  try {
    await service.removeTopProduct(req.params.id);
    res.status(204).end();
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};
