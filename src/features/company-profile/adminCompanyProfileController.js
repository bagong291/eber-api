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
    const item = await service.create(req.body);
    res.status(201).json({ status: 'success', data: item });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await service.update(req.params.id, req.body);
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