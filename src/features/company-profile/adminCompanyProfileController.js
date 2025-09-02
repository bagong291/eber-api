const CompanyProfileRepository = require('./companyProfileRepository');
const CompanyProfileService = require('./companyProfileService');
const repo = new CompanyProfileRepository();
const service = new CompanyProfileService(repo);

exports.list = async (req, res, next) => {
  try {
    const { search, page = 1, pageSize, limit, ...filters } = req.query;
    const effectivePageSize = Number(limit) || Number(pageSize) || 10;
    // Only show active profiles if not authenticated
    if (!req.user) {
      filters.status = true;
    }
    const items = await service.listProfiles({ search, ...filters }, Number(page), effectivePageSize);
    res.json({ status: 'success', data: items });
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await service.getById(req.params.id);
    // Only allow access to active profiles if not authenticated
    if (!req.user && !item.status) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    res.json({ status: 'success', data: item });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    // Handle multi-language payload transformation
    let payload = { ...req.body };
    
    // Transform main description field
    if (payload.description && !payload.description_en && !payload.description_id) {
      payload.description_en = payload.description;
      payload.description_id = payload.description;
    }
    
    // Transform nested data fields for multi-language
    if (payload.data) {
      const data = { ...payload.data };
      
      // Handle Product Application (p)
      if (data.p) {
        if (data.p.title && !data.p.title_en && !data.p.title_id) {
          data.p.title_en = data.p.title;
          data.p.title_id = data.p.title;
        }
        if (data.p.description && !data.p.description_en && !data.p.description_id) {
          data.p.description_en = data.p.description;
          data.p.description_id = data.p.description;
        }
      }
      
      // Handle titles and descriptions
      ['title_1', 'title_2', 'title_3', 'description_1', 'description_2', 'description_3'].forEach(field => {
        if (data[field] && !data[`${field}_en`] && !data[`${field}_id`]) {
          data[`${field}_en`] = data[field];
          data[`${field}_id`] = data[field];
        }
      });
      
      payload.data = data;
    }
    
    // Validate required multi-lang fields
    if (!payload.description_en || !payload.description_id) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Both English and Indonesian descriptions are required' 
      });
    }
    
    const item = await service.create(payload);
    res.status(201).json({ status: 'success', data: item });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    // Handle multi-language payload transformation
    let payload = { ...req.body };
    
    // Transform main description field
    if (payload.description && !payload.description_en && !payload.description_id) {
      payload.description_en = payload.description;
      payload.description_id = payload.description;
    }
    
    // Transform nested data fields for multi-language
    if (payload.data) {
      const data = { ...payload.data };
      
      // Handle Product Application (p)
      if (data.p) {
        if (data.p.title && !data.p.title_en && !data.p.title_id) {
          data.p.title_en = data.p.title;
          data.p.title_id = data.p.title;
        }
        if (data.p.description && !data.p.description_en && !data.p.description_id) {
          data.p.description_en = data.p.description;
          data.p.description_id = data.p.description;
        }
      }
      
      // Handle titles and descriptions
      ['title_1', 'title_2', 'title_3', 'description_1', 'description_2', 'description_3'].forEach(field => {
        if (data[field] && !data[`${field}_en`] && !data[`${field}_id`]) {
          data[`${field}_en`] = data[field];
          data[`${field}_id`] = data[field];
        }
      });
      
      payload.data = data;
    }
    
    const updated = await service.update(req.params.id, payload);
    res.json({ status: 'success', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await service.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}; 