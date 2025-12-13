const CertificateService = require('./certificateService');
const CertificateRepository = require('./certificateRepository');

const cr = new CertificateRepository();
const cs = new CertificateService(cr);

exports.listCertificates = async (req, res, next) => {
  try {
    const filter = {
      search: req.query.search,
      status: req.query.status
    };
    
    // Only show active certificates if not authenticated
    if (!req.user) {
      filter.status = true;
    }
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const items = await cs.listCertificates(filter, page, pageSize);
    res.json({ status: "success", data: items });
  } catch (error) {
    next(error);
  }
};

exports.getCertificateById = async (req, res, next) => {
  try {
    const item = await cs.getCertificateById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Certificate not found' });
    
    // Only allow access to active certificates if not authenticated
    if (!req.user && !item.status) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json({ status: "success", data: item });
  } catch (error) {
    next(error);
  }
};

exports.createCertificate = async (req, res, next) => {
  try {
    const newItem = await cs.createCertificate(req.body);
    res.status(201).json({ status: "success", data: newItem });
  } catch (error) {
    next(error);
  }
};

exports.updateCertificate = async (req, res, next) => {
  try {
    const updated = await cs.updateCertificate(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ status: "success", data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteCertificate = async (req, res, next) => {
  try {
    await cs.deleteCertificate(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
