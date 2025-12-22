const CareerService = require('./careerService');
const emailService = require('../../utils/emailService');

exports.listCareers = async (req, res, next) => {
  try {
    const { search, page = 1, pageSize, limit, ...filters } = req.query;
    const effectivePageSize = Number(limit) || Number(pageSize) || 10;
    
    // If no authenticated user, only show active careers
    if (!req.user) {
      filters.status = true;
    }
    
    const items = await CareerService.listCareers({ search, ...filters }, Number(page), effectivePageSize);
    res.json({status:"success",data:items});
  } catch (error) {
    next(error);
  }
};

exports.getCareerById = async (req, res, next) => {
  try {
    const item = await CareerService.getCareerById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Career not found' });
    
    // If no authenticated user, only allow access to active careers
    if (!req.user && !item.status) {
      return res.status(404).json({ message: 'Career not found' });
    }
    
    res.json({status:"success",data:item});
  } catch (error) {
    next(error);
  }
};

exports.createCareer = async (req, res, next) => {
  try {
    // Handle multi-language payload transformation
    let payload = { ...req.body };
    
    // If legacy format (description), transform to multi-lang
    if (payload.description && !payload.description_en && !payload.description_id) {
      payload.description_en = payload.description;
      payload.description_id = payload.description;
    }
    
    // Ensure required multi-lang fields exist
    if (!payload.description_en || !payload.description_id) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Both English and Indonesian job descriptions are required' 
      });
    }
    
    const newItem = await CareerService.createCareer(payload);
    res.status(201).json({status:"success",data:newItem});
  } catch (error) {
    next(error);
  }
};

exports.updateCareer = async (req, res, next) => {
  try {
    // Handle multi-language payload transformation
    let payload = { ...req.body };
    
    // If legacy format (description), transform to multi-lang
    if (payload.description && !payload.description_en && !payload.description_id) {
      payload.description_en = payload.description;
      payload.description_id = payload.description;
    }
    
    const updated = await CareerService.updateCareer(req.params.id, payload);
    if (!updated) return res.status(404).json({ message: 'Career not found' });
    res.json({status:"success",data:updated});
  } catch (error) {
    next(error);
  }
};

exports.deleteCareer = async (req, res, next) => {
  try {
    await CareerService.deleteCareer(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.submitCareerApplication = async (req, res, next) => {
  try {
    const { firstname, lastname, email, message } = req.body;
    
    // Validate required fields
    if (!firstname || !lastname || !email || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required: firstname, lastname, email, message'
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format'
      });
    }

    // Get uploaded file (if any)
    const file = req.file;

    // Validate file if uploaded
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return res.status(400).json({
          status: 'error',
          message: 'File size must not exceed 10MB'
        });
      }
    }

    // Prepare data for email
    const applicationData = {
      firstName: firstname,
      lastName: lastname,
      email,
      message
    };

    // Send email with attachment
    const emailResult = await emailService.sendCareerApplicationEmail(
      applicationData,
      file
    );

    res.status(201).json({
      status: 'success',
      message: 'Career application submitted successfully!',
      data: {
        emailSent: emailResult.success,
        applicant: {
          name: `${firstname} ${lastname}`,
          email
        },
        hasAttachment: !!file
      }
    });
  } catch (error) {
    console.error('Career application submission error:', error);
    next(error);
  }
};
