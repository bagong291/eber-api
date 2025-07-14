const HomeService = require('./homeService');

exports.listHome = async (req, res, next) => {
  try {
    const { search, page = 1, pageSize, limit, ...filters } = req.query;
    const effectivePageSize = Number(limit) || Number(pageSize) || 10;
    const items = await HomeService.listHome({ search, ...filters }, Number(page), effectivePageSize);
    res.json({status:"success",data:items});
  } catch (error) {
    next(error);
  }
};

exports.getHomeById = async (req, res, next) => {
  try {
    const item = await HomeService.getHomeById(req.params.id);
    if (!item) return res.status(404).json({ status:"failed",message: 'Home not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

exports.createHome = async (req, res, next) => {
  try {
    const newItem = await HomeService.createHome(req.body);
    res.status(201).json({status:"success",data:newItem});;
  } catch (error) {
    next(error);
  }
};

exports.updateHome = async (req, res, next) => {
  try {
    const updated = await HomeService.updateHome(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Home not found' });
    res.json({status:"success",data:updated});
  } catch (error) {
    next(error);
  }
};

exports.deleteHome = async (req, res, next) => {
  try {
    await HomeService.deleteHome(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
