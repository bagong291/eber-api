const Certificate = require('./Certificate');

class CertificateRepository {
  async findAll({ where = {}, limit = 10, offset = 0 }) {
    return Certificate.findAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
  }

  async count({ where = {} }) {
    return Certificate.count({ where });
  }

  async findById(id) {
    return Certificate.findByPk(id);
  }

  async createCertificate(payload) {
    return Certificate.create(payload);
  }

  async updateCertificate(id, payload) {
    const certificate = await Certificate.findByPk(id);
    if (!certificate) return null;
    return certificate.update(payload);
  }

  async deleteCertificate(id) {
    const certificate = await Certificate.findByPk(id);
    if (!certificate) return null;
    await certificate.destroy();
    return true;
  }
}

module.exports = CertificateRepository;
