const ContactRepository = require('./contactRepository');

class ContactService {
  static listContacts(filter = {}, page = 1, pageSize = 10) {
    return ContactRepository.findAll(filter, page, pageSize);
  }

  static getContactById(contactId) {
    return ContactRepository.findById(contactId);
  }

  static createContact(payload) {
    return ContactRepository.createContact(payload);
  }

  static deleteContact(contactId) {
    return ContactRepository.deleteContact(contactId);
  }
}

module.exports = ContactService;
