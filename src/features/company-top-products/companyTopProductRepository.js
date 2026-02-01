const CompanyTopProductModel = require('./CompanyTopProduct');
const ProductModel = require('../products/Product');
const CompanyProfileModel = require('../company-profile/CompanyProfile');

class CompanyTopProductRepository {
  // Get all companies with their top 3 products
  async findAllWithCompanies() {
    const companies = await CompanyProfileModel.findAll({
      attributes: ['id', 'name', 'location', 'status'], // Only essential fields
      order: [['name', 'ASC']]
    });

    const result = [];
    
    for (const company of companies) {
      const topProducts = await CompanyTopProductModel.findAll({
        where: { company_profile_id: company.id },
        include: [{
          model: ProductModel,
          as: 'product',
          attributes: ['id', 'code', 'segment', 'application_en', 'application_id', 'type', 'status']
        }],
        order: [['rank', 'ASC']]
      });

      result.push({
        company: company.toJSON(),
        topProducts: topProducts.map(tp => ({
          id: tp.id,
          rank: tp.rank,
          product: tp.product
        }))
      });
    }

    return result;
  }

  // Get top products for a specific company
  async findByCompanyId(companyId) {
    return CompanyTopProductModel.findAll({
      where: { company_profile_id: companyId },
      include: [{
        model: ProductModel,
        as: 'product'
      }],
      order: [['rank', 'ASC']]
    });
  }

  // Get by ID
  async findById(id) {
    return CompanyTopProductModel.findByPk(id, {
      include: [
        {
          model: ProductModel,
          as: 'product'
        },
        {
          model: CompanyProfileModel,
          as: 'company'
        }
      ]
    });
  }

  // Check if product already exists for company
  async findByCompanyAndProduct(companyId, productId) {
    return CompanyTopProductModel.findOne({
      where: { 
        company_profile_id: companyId,
        product_id: productId 
      }
    });
  }

  // Check if rank already exists for company
  async findByCompanyAndRank(companyId, rank) {
    return CompanyTopProductModel.findOne({
      where: { 
        company_profile_id: companyId,
        rank 
      }
    });
  }

  // Count top products for a company
  async countByCompany(companyId) {
    return CompanyTopProductModel.count({
      where: { company_profile_id: companyId }
    });
  }

  // Create new top product
  async create(data) {
    return CompanyTopProductModel.create(data);
  }

  // Update rank
  async update(id, updates) {
    const item = await this.findById(id);
    if (!item) return null;
    return item.update(updates);
  }

  // Delete
  async delete(id) {
    const item = await this.findById(id);
    if (!item) return null;
    return item.destroy();
  }

  // Reorder ranks after deletion for a specific company
  async reorderRanks(companyId) {
    const items = await CompanyTopProductModel.findAll({
      where: { company_profile_id: companyId },
      order: [['rank', 'ASC']]
    });
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].rank !== i + 1) {
        await items[i].update({ rank: i + 1 });
      }
    }
  }
}

module.exports = CompanyTopProductRepository;
