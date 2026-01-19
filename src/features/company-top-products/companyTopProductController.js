const CompanyTopProductRepository = require('./companyTopProductRepository');
const CompanyTopProductService = require('./companyTopProductService');

const repository = new CompanyTopProductRepository();
const service = new CompanyTopProductService(repository);

// Get all companies with their top 3 products
exports.listAll = async (req, res, next) => {
  try {
    const data = await service.listAll();
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

// Get top products for a specific company
exports.getByCompanyId = async (req, res, next) => {
  try {
    const data = await service.getByCompanyId(req.params.companyId);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

// Add top product to company
exports.addTopProduct = async (req, res, next) => {
  try {
    const { company_profile_id, product_id, rank } = req.body;
    
    if (!company_profile_id || !product_id || !rank) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'company_profile_id, product_id, and rank are required' 
      });
    }

    const data = await service.addTopProduct(company_profile_id, product_id, rank);
    res.status(201).json({ status: 'success', data });
  } catch (error) {
    if (error.message.includes('Maximum') || 
        error.message.includes('already') || 
        error.message.includes('taken')) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

// Update rank
exports.updateRank = async (req, res, next) => {
  try {
    const { rank } = req.body;
    
    if (!rank) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'rank is required' 
      });
    }

    const data = await service.updateRank(req.params.id, rank);
    res.json({ status: 'success', data });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

// Remove top product
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
