class CompanyProfileService {
  constructor(repository) {
    this.repository = repository;
  }

  async listProfiles() {
    return this.repository.findAll();
  }

  async getById(id) {
    const result = await this.repository.findById(id);
    if (!result) throw new Error('Company profile not found');
    return result;
  }

  async create(payload) {
    return this.repository.create(payload);
  }

  async update(id, payload) {
    const updated = await this.repository.update(id, payload);
    if (!updated) throw new Error('Profile not found for update');
    return updated;
  }

  async delete(id) {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new Error('Profile not found for delete');
    return true;
  }
}

module.exports = CompanyProfileService;
