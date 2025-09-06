const FormSubmission = require('./FormSubmission');
const { Op } = require('sequelize');

class FormSubmissionRepository {
  async create(data) {
    return await FormSubmission.create(data);
  }

  async findById(id) {
    return await FormSubmission.findByPk(id);
  }

  async findAll(filters = {}, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    
    // Build where clause for filtering
    const whereClause = {};
    
    if (filters.formType) {
      whereClause.formType = filters.formType;
    }
    
    if (filters.status) {
      whereClause.status = filters.status;
    }
    
    if (filters.email) {
      whereClause.email = { [Op.iLike]: `%${filters.email}%` };
    }
    
    if (filters.company) {
      whereClause.company = { [Op.iLike]: `%${filters.company}%` };
    }
    
    if (filters.dateFrom) {
      whereClause.createdAt = { [Op.gte]: new Date(filters.dateFrom) };
    }
    
    if (filters.dateTo) {
      if (whereClause.createdAt) {
        whereClause.createdAt[Op.lte] = new Date(filters.dateTo);
      } else {
        whereClause.createdAt = { [Op.lte]: new Date(filters.dateTo) };
      }
    }
    
    // Handle search across multiple fields
    if (filters.search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${filters.search}%` } },
        { lastName: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } },
        { company: { [Op.iLike]: `%${filters.search}%` } },
        { subject: { [Op.iLike]: `%${filters.search}%` } },
        { message: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }

    const { count, rows } = await FormSubmission.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });

    return {
      items: rows,
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / pageSize),
      pageSize
    };
  }

  async update(id, data) {
    const [affectedRows] = await FormSubmission.update(data, {
      where: { id },
      returning: true
    });
    
    if (affectedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    const deletedRows = await FormSubmission.destroy({
      where: { id }
    });
    
    return deletedRows > 0;
  }

  async markEmailSent(id) {
    return await this.update(id, {
      emailSent: true,
      emailSentAt: new Date(),
      status: 'sent'
    });
  }

  async markEmailFailed(id) {
    return await this.update(id, {
      emailSent: false,
      status: 'failed'
    });
  }

  async getStatistics() {
    const totalSubmissions = await FormSubmission.count();
    
    const submissionsByType = await FormSubmission.findAll({
      attributes: [
        'formType',
        [FormSubmission.sequelize.fn('COUNT', FormSubmission.sequelize.col('id')), 'count']
      ],
      group: ['formType'],
      raw: true
    });
    
    const submissionsByStatus = await FormSubmission.findAll({
      attributes: [
        'status',
        [FormSubmission.sequelize.fn('COUNT', FormSubmission.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });
    
    const recentSubmissions = await FormSubmission.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });

    return {
      totalSubmissions,
      recentSubmissions,
      byType: submissionsByType,
      byStatus: submissionsByStatus
    };
  }
}

module.exports = new FormSubmissionRepository();