class CompanyTopProductService {
  constructor(repository) {
    this.repository = repository;
  }

  // List all companies with their top products
  async listAll() {
    return this.repository.findAllWithCompanies();
  }

  // Get top products for a specific company
  async getByCompanyId(companyId) {
    return this.repository.findByCompanyId(companyId);
  }

  // Add top product to company
  async addTopProduct(companyId, productId, rank) {
    // Check if company already has 3 products
    const count = await this.repository.countByCompany(companyId);
    if (count >= 3) {
      throw new Error('Maximum 3 top products allowed per company. Please remove one before adding.');
    }

    // Check if product already exists for this company
    const existing = await this.repository.findByCompanyAndProduct(companyId, productId);
    if (existing) {
      throw new Error('Product is already in this company\'s top 3 list');
    }

    // Check if rank is already taken
    const rankTaken = await this.repository.findByCompanyAndRank(companyId, rank);
    if (rankTaken) {
      throw new Error(`Rank ${rank} is already taken for this company`);
    }

    // Validate rank
    if (rank < 1 || rank > 3) {
      throw new Error('Rank must be between 1 and 3');
    }

    return this.repository.create({
      company_profile_id: companyId,
      product_id: productId,
      rank
    });
  }

  // Update rank
  async updateRank(id, newRank) {
    // Validate rank
    if (newRank < 1 || newRank > 3) {
      throw new Error('Rank must be between 1 and 3');
    }

    const item = await this.repository.findById(id);
    if (!item) {
      throw new Error('Top product not found');
    }

    const oldRank = item.rank;
    const companyId = item.company_profile_id;
    
    // If rank is the same, no need to update
    if (oldRank === newRank) {
      return item;
    }

    // Check if new rank is already taken by another product in same company
    const rankTaken = await this.repository.findByCompanyAndRank(companyId, newRank);
    
    if (rankTaken && rankTaken.id !== id) {
      // Swap ranks
      const tempRank = -1;
      
      await item.update({ rank: tempRank }, { validate: false });
      await rankTaken.update({ rank: oldRank });
      await item.update({ rank: newRank });
    } else {
      await item.update({ rank: newRank });
    }

    return this.repository.findById(id);
  }

  // Remove top product
  async removeTopProduct(id) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new Error('Top product not found');
    }

    const companyId = item.company_profile_id;
    await this.repository.delete(id);

    // Reorder remaining products for this company
    await this.repository.reorderRanks(companyId);
    
    return true;
  }
}

module.exports = CompanyTopProductService;
