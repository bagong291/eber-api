const CareerModel = require('./Career');

class CareerRepository {
  static findAll() {
    return CareerModel.findAll({ order: [['created_at', 'DESC']] });
  }

  static findById(careerId) {
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
