const ContactRepository = require('./contactRepository');

class ContactService {
  static listContacts() {
    return ContactRepository.findAll();
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
