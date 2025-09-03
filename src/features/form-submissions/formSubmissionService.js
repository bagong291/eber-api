const formSubmissionRepository = require('./formSubmissionRepository');
const emailService = require('../../utils/emailService');

class FormSubmissionService {
  async submitForm(formData, requestInfo = {}) {
    try {
      // Extract IP address and user agent from request
      const submissionData = {
        ...formData,
        ipAddress: requestInfo.ip,
        userAgent: requestInfo.userAgent
      };

      // Save form submission to database
      const submission = await formSubmissionRepository.create(submissionData);
      
      // Try to send email notification
      let emailResult = null;
      try {
        emailResult = await emailService.sendFormSubmissionNotification(formData);
        
        // Mark email as sent in database
        if (emailResult.success) {
          await formSubmissionRepository.markEmailSent(submission.id);
        }
      } catch (emailError) {
        console.error('Email sending failed for submission:', submission.id, emailError);
        // Don't fail the entire submission if email fails
        emailResult = { success: false, error: emailError.message };
      }

      return {
        success: true,
        submission,
        emailSent: emailResult ? emailResult.success : false,
        emailError: emailResult && !emailResult.success ? emailResult.error : null
      };
    } catch (error) {
      console.error('Form submission failed:', error);
      throw error;
    }
  }

  async getSubmissions(filters = {}, page = 1, pageSize = 10) {
    try {
      return await formSubmissionRepository.findAll(filters, page, pageSize);
    } catch (error) {
      console.error('Failed to retrieve submissions:', error);
      throw error;
    }
  }

  async getSubmissionById(id) {
    try {
      const submission = await formSubmissionRepository.findById(id);
      if (!submission) {
        throw new Error('Form submission not found');
      }
      return submission;
    } catch (error) {
      console.error('Failed to retrieve submission:', error);
      throw error;
    }
  }

  async updateSubmissionStatus(id, status) {
    try {
      const validStatuses = ['pending', 'responded', 'resolved', 'spam'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const updatedSubmission = await formSubmissionRepository.update(id, { status });
      if (!updatedSubmission) {
        throw new Error('Form submission not found');
      }
      
      return updatedSubmission;
    } catch (error) {
      console.error('Failed to update submission status:', error);
      throw error;
    }
  }

  async deleteSubmission(id) {
    try {
      const deleted = await formSubmissionRepository.delete(id);
      if (!deleted) {
        throw new Error('Form submission not found');
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to delete submission:', error);
      throw error;
    }
  }

  async resendEmail(id) {
    try {
      const submission = await formSubmissionRepository.findById(id);
      if (!submission) {
        throw new Error('Form submission not found');
      }

      // Prepare form data for email
      const formData = {
        firstName: submission.firstName,
        lastName: submission.lastName,
        email: submission.email,
        phone: submission.phone,
        company: submission.company,
        subject: submission.subject,
        message: submission.message,
        formType: submission.formType
      };

      const emailResult = await emailService.sendFormSubmissionNotification(formData);
      
      if (emailResult.success) {
        await formSubmissionRepository.markEmailSent(id);
      }

      return {
        success: emailResult.success,
        messageId: emailResult.userMessageId
      };
    } catch (error) {
      console.error('Failed to resend email:', error);
      throw error;
    }
  }

  async getStatistics() {
    try {
      return await formSubmissionRepository.getStatistics();
    } catch (error) {
      console.error('Failed to retrieve statistics:', error);
      throw error;
    }
  }

  async sendCustomResponse(id, subject, message) {
    try {
      const submission = await formSubmissionRepository.findById(id);
      if (!submission) {
        throw new Error('Form submission not found');
      }

      const companyName = process.env.COMPANY_NAME || 'Your Company';
      const websiteUrl = process.env.WEBSITE_URL || 'https://yourcompany.com';
      const productListUrl = `${websiteUrl}/products`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Response from ${companyName}
          </h2>
          
          <p>Dear ${submission.firstName} ${submission.lastName},</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Regarding: ${submission.subject}</h3>
            <div style="white-space: pre-wrap; line-height: 1.6;">${message}</div>
          </div>
          
          <div style="background: #e7f3ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #0056b3; margin-top: 0;">Explore Our Products</h3>
            <p>Take a look at our complete product catalog:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${productListUrl}" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                View Our Products
              </a>
            </div>
          </div>
          
          <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; color: #666; font-size: 14px;">
            <p>Best regards,<br>
            The ${companyName} Team</p>
          </div>
        </div>
      `;

      const emailResult = await emailService.sendCustomEmail(
        submission.email,
        subject,
        htmlContent
      );

      if (emailResult.success) {
        // Update submission status to responded
        await formSubmissionRepository.update(id, { status: 'responded' });
      }

      return emailResult;
    } catch (error) {
      console.error('Failed to send custom response:', error);
      throw error;
    }
  }

  async submitInstantAccessForm(formData, requestInfo = {}) {
    try {
      // Validate instant access form data
      const validation = this.validateInstantAccessFormData(formData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Set default values for instant access form
      const submissionData = {
        firstName: formData.fullName ? formData.fullName.split(' ')[0] : formData.firstName || '',
        lastName: formData.fullName ? formData.fullName.split(' ').slice(1).join(' ') || 'User' : formData.lastName || 'User',
        email: formData.email,
        phone: formData.phone || formData.phoneNumber,
        company: formData.company || null,
        city: formData.city || null,
        subject: 'Instant Access Request',
        message: `User requested instant access to products catalog.${formData.company ? ` Company: ${formData.company}` : ''}${formData.city ? ` City: ${formData.city}` : ''}`,
        formType: 'instant_access',
        ipAddress: requestInfo.ip,
        userAgent: requestInfo.userAgent
      };

      // Save form submission to database
      const submission = await formSubmissionRepository.create(submissionData);
      
      // Try to send email notification with product list link
      let emailResult = null;
      try {
        emailResult = await emailService.sendInstantAccessNotification({
          fullName: formData.fullName || `${submissionData.firstName} ${submissionData.lastName}`,
          email: formData.email,
          phone: formData.phone || formData.phoneNumber,
          company: formData.company,
          city: formData.city
        });
        
        // Mark email as sent in database
        if (emailResult.success) {
          await formSubmissionRepository.markEmailSent(submission.id);
        }
      } catch (emailError) {
        console.error('Email sending failed for instant access submission:', submission.id, emailError);
        // Don't fail the entire submission if email fails
        emailResult = { success: false, error: emailError.message };
      }

      return {
        success: true,
        submission,
        emailSent: emailResult ? emailResult.success : false,
        emailError: emailResult && !emailResult.success ? emailResult.error : null
      };
    } catch (error) {
      console.error('Instant access form submission failed:', error);
      throw error;
    }
  }

  validateInstantAccessFormData(data) {
    const errors = [];

    // Full name validation (can be split into first/last name)
    if (!data.fullName && (!data.firstName || !data.lastName)) {
      errors.push('Full name is required');
    }
    
    if (data.fullName && data.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }

    // Email validation
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Valid email address is required');
    }

    // Phone validation (required for instant access)
    if (!data.phone && !data.phoneNumber) {
      errors.push('Phone number is required');
    }

    // Optional field validations
    if (data.company && data.company.length > 200) {
      errors.push('Company name must be less than 200 characters');
    }

    if (data.city && data.city.length > 100) {
      errors.push('City name must be less than 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateFormData(data) {

    if (!data.firstName || data.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters long');
    }

    if (!data.lastName || data.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters long');
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Valid email address is required');
    }

    if (!data.subject || data.subject.trim().length < 5) {
      errors.push('Subject must be at least 5 characters long');
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    if (data.formType && !['inquiry', 'quote_request', 'contact', 'partnership', 'support', 'instant_access'].includes(data.formType)) {
      errors.push('Invalid form type');
    }

    if (data.phone && data.phone.length > 20) {
      errors.push('Phone number must be less than 20 characters');
    }

    if (data.company && data.company.length > 200) {
      errors.push('Company name must be less than 200 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = new FormSubmissionService();