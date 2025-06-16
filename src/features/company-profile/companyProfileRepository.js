const CompanyProfileModel = require('./CompanyProfile');

class CompanyProfileRepository {
  async findAll() {
    return CompanyProfileModel.findAll({ order: [['createdAt', 'DESC']] });
  }

  async findById(id) {
    return CompanyProfileModel.findByPk(id);
  }

  async create(data) {
    return CompanyProfileModel.create(data);
  }

  async update(id, updates) {
    const profile = await this.findById(id);
    if (!profile) return null;
    return profile.update(updates);
  }

  async delete(id) {
    const profile = await this.findById(id);
    if (!profile) return null;
    return profile.destroy();
  }
}

module.exports = CompanyProfileRepository;
