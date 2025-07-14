const HomeModel = require('./Home');

class HomeRepository {
  static async findAll(filter = {}, page = 1, pageSize = 10) {
    const where = {};
    // Global search (title, content, etc.)
    if (filter.search) {
      where['$or'] = [
        { title: { $like: `%${filter.search}%` } },
        { content: { $like: `%${filter.search}%` } }
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
      HomeModel.findAll({ where, order: [['created_at', 'DESC']], limit, offset }),
      HomeModel.count({ where })
    ]);
    return {
      data,
      meta: { page: Number(page), pageSize: limit, total }
    };
  }

  static findById(homeId) {
    return HomeModel.findByPk(homeId);
  }

  static createHome(data) {
    return HomeModel.create(data);
  }

  static updateHome(homeId, updates) {
    return HomeModel.findByPk(homeId)
      .then(home => home && home.update(updates));
  }

  static deleteHome(homeId) {
    return HomeModel.findByPk(homeId)
      .then(home => home && home.destroy());
  }
}

module.exports = HomeRepository;
