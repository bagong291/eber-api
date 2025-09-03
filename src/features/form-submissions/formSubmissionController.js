const formSubmissionService = require('./formSubmissionService');

class FormSubmissionController {
  // Public endpoint for instant access form submission
  async submitInstantAccessForm(req, res, next) {
    try {
      // Validate request data
      const validation = formSubmissionService.validateInstantAccessFormData(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      // Extract request information
      const requestInfo = {
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      };

      // Submit instant access form
      const result = await formSubmissionService.submitInstantAccessForm(req.body, requestInfo);
      
      // Return success response
      const response = {
        status: 'success',
        message: 'Thank you! Check your email for instant access to our product catalog.',
        data: {
          id: result.submission.id,
          emailSent: result.emailSent,
          message: 'We\'ve sent you an email with direct access to our complete product catalog.'
        }
      };

      // Include email error in response if email failed but form was saved
      if (!result.emailSent && result.emailError) {
        response.warning = 'Request was saved but email notification failed';
        response.emailError = result.emailError;
      }

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Public endpoint for form submission
  async submitForm(req, res, next) {
    try {
      // Validate request data
      const validation = formSubmissionService.validateFormData(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      // Extract request information
      const requestInfo = {
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      };

      // Submit form
      const result = await formSubmissionService.submitForm(req.body, requestInfo);
      
      // Return success response
      const response = {
        status: 'success',
        message: 'Form submitted successfully',
        data: {
          id: result.submission.id,
          emailSent: result.emailSent
        }
      };

      // Include email error in response if email failed but form was saved
      if (!result.emailSent && result.emailError) {
        response.warning = 'Form was saved but email notification failed';
        response.emailError = result.emailError;
      }

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Admin endpoints - require authentication
  async getSubmissions(req, res, next) {
    try {
      const { search, page = 1, pageSize = 10, limit, formType, status, email, company, dateFrom, dateTo, ...filters } = req.query;
      const effectivePageSize = Number(limit) || Number(pageSize) || 10;
      
      const filterParams = {
        search,
        formType,
        status,
        email,
        company,
        dateFrom,
        dateTo,
        ...filters
      };

      const result = await formSubmissionService.getSubmissions(filterParams, Number(page), effectivePageSize);
      
      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getSubmissionById(req, res, next) {
    try {
      const submission = await formSubmissionService.getSubmissionById(req.params.id);
      
      res.json({
        status: 'success',
        data: submission
      });
    } catch (error) {
      if (error.message === 'Form submission not found') {
        return res.status(404).json({
          status: 'error',
          message: 'Form submission not found'
        });
      }
      next(error);
    }
  }

  async updateSubmissionStatus(req, res, next) {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({
          status: 'error',
          message: 'Status is required'
        });
      }

      const updatedSubmission = await formSubmissionService.updateSubmissionStatus(req.params.id, status);
      
      res.json({
        status: 'success',
        message: 'Submission status updated successfully',
        data: updatedSubmission
      });
    } catch (error) {
      if (error.message === 'Form submission not found') {
        return res.status(404).json({
          status: 'error',
          message: 'Form submission not found'
        });
      }
      if (error.message.includes('Invalid status')) {
        return res.status(400).json({
          status: 'error',
          message: error.message
        });
      }
      next(error);
    }
  }

  async deleteSubmission(req, res, next) {
    try {
      await formSubmissionService.deleteSubmission(req.params.id);
      
      res.status(204).end();
    } catch (error) {
      if (error.message === 'Form submission not found') {
        return res.status(404).json({
          status: 'error',
          message: 'Form submission not found'
        });
      }
      next(error);
    }
  }

  async resendEmail(req, res, next) {
    try {
      const result = await formSubmissionService.resendEmail(req.params.id);
      
      res.json({
        status: 'success',
        message: 'Email resent successfully',
        data: {
          emailSent: result.success,
          messageId: result.messageId
        }
      });
    } catch (error) {
      if (error.message === 'Form submission not found') {
        return res.status(404).json({
          status: 'error',
          message: 'Form submission not found'
        });
      }
      next(error);
    }
  }

  async sendCustomResponse(req, res, next) {
    try {
      const { subject, message } = req.body;
      
      if (!subject || !message) {
        return res.status(400).json({
          status: 'error',
          message: 'Subject and message are required'
        });
      }

      const result = await formSubmissionService.sendCustomResponse(req.params.id, subject, message);
      
      res.json({
        status: 'success',
        message: 'Custom response sent successfully',
        data: {
          emailSent: result.success,
          messageId: result.messageId
        }
      });
    } catch (error) {
      if (error.message === 'Form submission not found') {
        return res.status(404).json({
          status: 'error',
          message: 'Form submission not found'
        });
      }
      next(error);
    }
  }

  async getStatistics(req, res, next) {
    try {
      const statistics = await formSubmissionService.getStatistics();
      
      res.json({
        status: 'success',
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  }

  // Health check endpoint for email service
  async checkEmailService(req, res, next) {
    try {
      const emailService = require('../../utils/emailService');
      const isConnected = await emailService.verifyConnection();
      
      res.json({
        status: 'success',
        data: {
          emailServiceConnected: isConnected
        }
      });
    } catch (error) {
      res.json({
        status: 'warning',
        data: {
          emailServiceConnected: false,
          error: error.message
        }
      });
    }
  }
}

module.exports = new FormSubmissionController();