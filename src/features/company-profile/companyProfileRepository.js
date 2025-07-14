const CompanyProfileModel = require('./CompanyProfile');

class CompanyProfileRepository {
  async findAll(filter = {}, page = 1, pageSize = 10) {
    const where = {};
    // Global search (name, location, etc.)
    if (filter.search) {
      where['$or'] = [
        { name: { $like: `%${filter.search}%` } },
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
      CompanyProfileModel.findAll({ where, order: [['createdAt', 'DESC']], limit, offset }),
      CompanyProfileModel.count({ where })
    ]);
    return {
      data,
      meta: { page: Number(page), pageSize: limit, total }
    };
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
