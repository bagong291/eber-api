const CareerModel = require('./Career');

class CareerRepository {
  static async findAll(filter = {}, page = 1, pageSize = 10) {
    const where = {};
    // Global search (position/location/description)
    if (filter.search) {
      where['$or'] = [
        { position: { $like: `%${filter.search}%` } },
        { location: { $like: `%${filter.search}%` } },
        { description: { $like: `%${filter.search}%` } }
      ];
    }
    // Add other filters
    Object.keys(filter).forEach(key => {
      if (key !== 'search') {
        where[key] = filter[key];
      }
    });
    const limit = Math.min(Number(pageSize) || 10, 100);
    const offset = (Number(page) - 1) * limit;
    const [data, total] = await Promise.all([
      CareerModel.findAll({ where, order: [['created_at', 'DESC']], limit, offset }),
      CareerModel.count({ where })
    ]);
    return {
      data,
      meta: { page: Number(page), pageSize: limit, total }
    };
  }

  static findById(careerId) {
    console.log(careerId)
    return CareerModel.findByPk(careerId);
  }
  

  static createCareer(data) {
    return CareerModel.create(data);
  }

  static updateCareer(careerId, updates) {
    return CareerModel.findByPk(careerId)
      .then(career => career && career.update(updates));
  }

  static deleteCareer(careerId) {
    return CareerModel.findByPk(careerId)
      .then(career => career && career.destroy());
  }
}

module.exports = CareerRepository;
