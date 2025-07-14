const CareerRepository = require('./careerRepository');

class CareerService {
  static listCareers(filter = {}, page = 1, pageSize = 10) {
    return CareerRepository.findAll(filter, page, pageSize);
  }

  static getCareerById(careerId) {
    return CareerRepository.findById(careerId);
  }

  static createCareer(payload) {
    return CareerRepository.createCareer(payload);
  }

  static updateCareer(careerId, payload) {
    return CareerRepository.updateCareer(careerId, payload);
  }

  static deleteCareer(careerId) {
    return CareerRepository.deleteCareer(careerId);
  }
}

module.exports = CareerService;
