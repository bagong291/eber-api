const CareerService = require('./careerService');

exports.listCareers = async (req, res, next) => {
  try {
    const items = await CareerService.listCareers();
    res.json({status:"success",data:items});
  } catch (error) {
    next(error);
  }
};

exports.getCareerById = async (req, res, next) => {
  try {
    const item = await CareerService.getCareerById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Career not found' });
    res.json({status:"success",data:item});
  } catch (error) {
    next(error);
  }
};

exports.createCareer = async (req, res, next) => {
  try {
    const newItem = await CareerService.createCareer(req.body);
    res.status(201).json({status:"success",data:newItem});
  } catch (error) {
    next(error);
  }
};

exports.updateCareer = async (req, res, next) => {
  try {
    const updated = await CareerService.updateCareer(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Career not found' });
    res.json({status:"success",data:updated});
  } catch (error) {
    next(error);
  }
};

exports.deleteCareer = async (req, res, next) => {
  try {
    await CareerService.deleteCareer(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
