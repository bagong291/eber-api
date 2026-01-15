const emailService = require('../../utils/emailService');

// Email type configurations
const EMAIL_TYPES = {
  'contact': {
    envKey: 'CONTACT_EMAIL_TO',
    defaultEmail: 'contact@company.com',
    subject: (firstName, lastName) => `Contact Request - ${firstName} ${lastName}`,
    badge: '💬 Contact Form',
    title: 'New Message Received'
  },
  'custom-product': {
    envKey: 'PRODUCT_EMAIL_TO',
    defaultEmail: 'product@company.com',
    subject: (firstName, lastName) => `Custom Product Request - ${firstName} ${lastName}`,
    badge: '🎨 Custom Product',
    title: 'New Custom Product Request'
  }
};

exports.sendEmail = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { firstname, lastname, email, message } = req.body;
    
    // Validate email type
    if (!EMAIL_TYPES[type]) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid email type. Supported types: ${Object.keys(EMAIL_TYPES).join(', ')}`
      });
    }
    
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

    // Validate message length
    if (message.trim().length < 10) {
      return res.status(400).json({
        status: 'error',
        message: 'Message must be at least 10 characters long'
      });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({
        status: 'error',
        message: 'Message must not exceed 1000 characters'
      });
    }

    // Get email config for this type
    const config = EMAIL_TYPES[type];

    // Prepare data
    const emailData = {
      firstName: firstname,
      lastName: lastname,
      email,
      message,
      type,
      config
    };

    // Send email using unified service
    const emailResult = await emailService.sendUnifiedEmail(emailData);

    res.status(201).json({
      status: 'success',
      message: 'Your message has been sent successfully!',
      data: {
        emailSent: emailResult.success,
        sender: {
          name: `${firstname} ${lastname}`,
          email
        },
        type,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Email sending error:', error);
    next(error);
  }
};
