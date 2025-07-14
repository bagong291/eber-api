const ContactModel = require('./Contact');

class ContactRepository {
  static async findAll(filter = {}, page = 1, pageSize = 10) {
    const where = {};
    // Global search (name, email, message, etc.)
    if (filter.search) {
      where['$or'] = [
        { name: { $like: `%${filter.search}%` } },
        { email: { $like: `%${filter.search}%` } },
        { message: { $like: `%${filter.search}%` } }
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
      ContactModel.findAll({ where, order: [['created_at', 'DESC']], limit, offset }),
      ContactModel.count({ where })
    ]);
    return {
      data,
      meta: { page: Number(page), pageSize: limit, total }
    };
  }

  static findById(contactId) {
    return ContactModel.findByPk(contactId);
  }

  static createContact(data) {
    return ContactModel.create(data);
  }

  static deleteContact(contactId) {
    return ContactModel.findByPk(contactId)
      .then(contact => contact && contact.destroy());
  }
}

module.exports = ContactRepository;
