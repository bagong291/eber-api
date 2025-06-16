const ContactModel = require('./Contact');

class ContactRepository {
  static findAll() {
    return ContactModel.findAll({ order: [['created_at', 'DESC']] });
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
