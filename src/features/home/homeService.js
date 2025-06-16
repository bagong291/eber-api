const HomeRepository = require('./homeRepository');

class HomeService {
  static listHome() {
    return HomeRepository.findAll();
  }

  static getHomeById(homeId) {
    return HomeRepository.findById(homeId);
  }

  static createHome(payload) {
    return HomeRepository.createHome(payload);
  }

  static updateHome(homeId, payload) {
    return HomeRepository.updateHome(homeId, payload);
  }

  static deleteHome(homeId) {
    return HomeRepository.deleteHome(homeId);
  }
}

module.exports = HomeService;
