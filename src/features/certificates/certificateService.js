const { Op } = require('sequelize');

class CertificateService {
  constructor(certificateRepository) {
    this.certificateRepository = certificateRepository;
  }

  async listCertificates(filter = {}, page = 1, pageSize = 10) {
    const where = {};

    // Global search
    if (filter.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${filter.search}%` } }
      ];
    }

    // Filter by status
    if (filter.status !== undefined) {
      where.status = filter.status === true || filter.status === 'true';
    }

    const limit = Math.min(pageSize, 100);
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.certificateRepository.findAll({ where, limit, offset }),
      this.certificateRepository.count({ where })
    ]);

    return {
      data,
      meta: { page, total, pageSize: limit }
    };
  }

  async getCertificateById(certificateId) {
    const certificate = await this.certificateRepository.findById(certificateId);
    if (!certificate) {
      throw new Error('Certificate not found');
    }
    return certificate;
  }

  async createCertificate(payload) {
    return this.certificateRepository.createCertificate(payload);
  }

  async updateCertificate(certificateId, payload) {
    const updated = await this.certificateRepository.updateCertificate(certificateId, payload);
    if (!updated) {
      throw new Error('Certificate not found for update');
    }
    return updated;
  }

  async deleteCertificate(certificateId) {
    const deleted = await this.certificateRepository.deleteCertificate(certificateId);
    if (!deleted) {
      throw new Error('Certificate not found for deletion');
    }
    return true;
  }
}

module.exports = CertificateService;
