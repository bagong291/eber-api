const ContactService = require('./contactService');

exports.listContacts = async (req, res, next) => {
  try {
    const items = await ContactService.listContacts();
    res.json({status:"success",data:items});
  } catch (error) {
    next(error);
  }
};

exports.getContactById = async (req, res, next) => {
  try {
    const item = await ContactService.getContactById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Contact not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

exports.createContact = async (req, res, next) => {
  try {
    const newItem = await ContactService.createContact(req.body);
    res.status(201).json({status:"success",data:newItem});;
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    await ContactService.deleteContact(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
