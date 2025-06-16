const HomeModel = require('./Home');

class HomeRepository {
  static findAll() {
    return HomeModel.findAll({ order: [['created_at', 'DESC']] });
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
