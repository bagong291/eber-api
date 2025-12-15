const axios = require('axios');
const FormData = require('form-data');

class EmailService {
  constructor() {
    this.apiUrl = process.env.EMAIL_API_URL || 'https://email.agepedia.info/api/v1/emails/send';
    this.apiKey = process.env.EMAIL_API_KEY;
    this.fromEmail = process.env.EMAIL_FROM || 'sinergiciptasolusidigital@gmail.com';
  }

  async verifyConnection() {
    try {
      if (!this.apiKey) {
        console.error('EMAIL_API_KEY is not configured');
        return false;
      }
      console.log('Email API configured successfully');
      return true;
    } catch (error) {
      console.error('Email API configuration verification failed:', error);
      return false;
    }
  }

  async sendEmail({ to, subject, htmlBody, textBody, cc }) {
    try {
      const formData = new FormData();
      formData.append('from_email', this.fromEmail);
      formData.append('to', to);
      if (cc) formData.append('cc', cc);
      formData.append('subject', subject);
      formData.append('body', htmlBody || textBody);
      formData.append('is_html', htmlBody ? 'true' : 'false');

      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          'X-API-Key': this.apiKey,
          ...formData.getHeaders()
        }
      });

      return {
        success: true,
        messageId: response.data.message_id || 'sent',
        data: response.data
      };
    } catch (error) {
      console.error('Failed to send email:', error.response?.data || error.message);
      throw new Error(`Email sending failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async sendFormSubmissionNotification(formData) {
    const { firstName, lastName, email, phone, company, subject, message, formType } = formData;
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@company.com';
    const companyName = process.env.COMPANY_NAME || 'Your Company';
    const websiteUrl = process.env.WEBSITE_URL || 'https://yourcompany.com';
    const headerImageUrl = `${process.env.BACKEND_URL}/uploads/header.png`;
    const productListUrl = `${websiteUrl}/products`;

    // Email to admin
    const adminHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; background: #f8f9fa;">
          <img src="${headerImageUrl}" alt="${companyName} Header" style="max-width: 100%; height: auto; display: block; margin: 0 auto;"/>
        </div>
        <div style="padding: 40px 30px;">
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; font-size: 24px; margin: 0 0 10px 0; font-weight: 600;">New Form Submission - ${formType.charAt(0).toUpperCase() + formType.slice(1)}</h2>
          </div>
          <div style="background: #f8f9ff; border-left: 4px solid #667eea; padding: 25px; margin: 30px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">Contact Information</h3>
            <div style="color: #555; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a></p>
              ${phone ? `<p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
              ${company ? `<p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${company}</p>` : ''}
            </div>
          </div>
          <div style="background: #fff7e6; border: 1px solid #ffd56b; border-radius: 8px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #b8860b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Message Details</h3>
            <p style="color: #8b6914; margin: 0 0 15px 0; font-size: 16px;"><strong>Subject:</strong> ${subject}</p>
            <div style="color: #8b6914;">
              <strong>Message:</strong>
              <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 8px; border: 1px solid #e0e6ed; white-space: pre-wrap;">${message}</div>
            </div>
          </div>
          <div style="background: #f0f7ff; border-radius: 8px; padding: 25px; margin: 30px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 16px; font-weight: 500;">
              <strong>Submission Time:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    `;

    // User auto-response
    const userHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; background: #f8f9fa;">
          <img src="${headerImageUrl}" alt="${companyName} Header" style="max-width: 100%; height: auto; display: block; margin: 0 auto;"/>
        </div>
        <div style="padding: 40px 30px;">
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; font-size: 24px; margin: 0 0 10px 0; font-weight: 600;">Thank You for Your ${formType.charAt(0).toUpperCase() + formType.slice(1)}</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0;">Dear ${firstName} ${lastName},</p>
          </div>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Thank you for reaching out to us! We have received your ${formType} and will get back to you within 24-48 hours.</p>
          <div style="background: #f8f9ff; border-left: 4px solid #667eea; padding: 25px; margin: 30px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">Your Submission Summary</h3>
            <div style="color: #555; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 0;"><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
          <div style="background: #fff7e6; border: 1px solid #ffd56b; border-radius: 8px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #b8860b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Explore Our Products</h3>
            <p style="color: #8b6914; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">While you wait for our response, feel free to browse our complete product catalog:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${productListUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                📋 View Our Products
              </a>
            </div>
          </div>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-top: 1px solid #e9ecef;">
          <div style="text-align: center;">
            <p style="color: #6c757d; margin: 0 0 15px 0; font-size: 16px; font-weight: 500;">With warmest regards,</p>
            <p style="color: #495057; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">The ${companyName} Team</p>
          </div>
        </div>
      </div>
    `;

    try {
      // Send both emails
      const adminResult = await this.sendEmail({
        to: adminEmail,
        cc: process.env.SMTP_CC,
        subject: `New ${formType} submission: ${subject}`,
        htmlBody: adminHtml
      });

      const userResult = await this.sendEmail({
        to: email,
        cc: process.env.SMTP_CC,
        subject: `Thank you for contacting ${companyName}`,
        htmlBody: userHtml
      });
      
      console.log('Admin notification sent:', adminResult.messageId);
      console.log('User auto-response sent:', userResult.messageId);
      
      return {
        success: true,
        adminMessageId: adminResult.messageId,
        userMessageId: userResult.messageId
      };
    } catch (error) {
      console.error('Failed to send emails:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  async sendInstantAccessNotification(formData) {
    const { fullName, email, phone, company, city } = formData;
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@company.com';
    const companyName = process.env.COMPANY_NAME || 'Your Company';
    const websiteUrl = process.env.WEBSITE_URL || 'https://yourcompany.com';
    const headerImageUrl =`${process.env.BACKEND_URL}/uploads/header.png`;
    
    const userData = {
      name: fullName,
      email: email,
      timestamp: new Date().toISOString()
    };
    const encodedUserData = Buffer.from(JSON.stringify(userData)).toString('base64');
    const productListUrl = `${websiteUrl}/product?access=${encodedUserData}`;

    const adminHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
        <div style="text-align: center; background: #f8f9fa;">
          <img src="${headerImageUrl}" alt="${companyName} Header" style="max-width: 100%; height: auto;"/>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #333; font-size: 24px; margin: 0 0 10px 0;">New Instant Access Request</h2>
          <div style="background: #f8f9ff; border-left: 4px solid #667eea; padding: 25px; margin: 30px 0;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            ${city ? `<p><strong>City:</strong> ${city}</p>` : ''}
          </div>
        </div>
      </div>
    `;

    const userHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
        <div style="text-align: center; background: #f8f9fa;">
          <img src="${headerImageUrl}" alt="${companyName} Header" style="max-width: 100%; height: auto;"/>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #333; font-size: 24px;">Welcome to ${companyName}!</h2>
          <p>Dear ${fullName},</p>
          <p>Thank you for requesting instant access to our product catalog!</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${productListUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 50px; display: inline-block;">
              🛍️ View Product Catalog
            </a>
          </div>
        </div>
      </div>
    `;

    try {
      const adminResult = await this.sendEmail({
        to: adminEmail,
        cc: process.env.SMTP_CC,
        subject: `New Instant Access Request from ${fullName}`,
        htmlBody: adminHtml
      });

      const userResult = await this.sendEmail({
        to: email,
        cc: process.env.SMTP_CC,
        subject: `Welcome! Your Instant Access to ${companyName} Products`,
        htmlBody: userHtml
      });
      
      console.log('Admin instant access notification sent:', adminResult.messageId);
      console.log('User instant access response sent:', userResult.messageId);
      
      return {
        success: true,
        adminMessageId: adminResult.messageId,
        userMessageId: userResult.messageId,
        productUrl: productListUrl,
        encodedData: encodedUserData
      };
    } catch (error) {
      console.error('Failed to send instant access emails:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  async sendProductEmail(email, productCode, productData) {
    const companyName = process.env.COMPANY_NAME || 'Your Company';
    const websiteUrl = process.env.WEBSITE_URL || 'https://yourcompany.com';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@company.com';
    const headerImageUrl =`${process.env.BACKEND_URL}/uploads/header.png`;
    
    const formattedProductCode = productCode.replace('_', ' ');
    
    const userHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
        <div style="text-align: center; background: #f8f9fa;">
          <img src="${headerImageUrl}" alt="${companyName} Header" style="max-width: 100%; height: auto;"/>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #333; font-size: 24px;">Dear Friends,</h2>
          <p style="color: #666;">Thank you so much for your interest in our product.</p>
          <div style="background: #f8f9ff; border-left: 4px solid #667eea; padding: 25px; margin: 30px 0;">
            <h3 style="color: #333;">Product Details</h3>
            <p><strong>Product Code:</strong> ${formattedProductCode}</p>
            ${productData?.application_en ? `<p><strong>Application:</strong> ${productData.application_en}</p>` : ''}
            ${productData?.type ? `<p><strong>Type:</strong> ${productData.type}</p>` : ''}
            ${productData?.performanceFeature_en ? `<div><strong>Performance Features:</strong><div style="background: white; padding: 15px; border-radius: 6px; margin-top: 8px;">${productData.performanceFeature_en}</div></div>` : ''}
          </div>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${websiteUrl}/product?code=${productCode}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 50px; display: inline-block;">
              📋 View Complete Product Details
            </a>
          </div>
        </div>
        <div style="background: #f8f9fa; padding: 30px; text-align: center;">
          <p style="color: #6c757d; margin: 0;">With warmest regards,</p>
          <p style="color: #495057; font-weight: 600;">The ${companyName} Team</p>
        </div>
      </div>
    `;

    const adminHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto;">
        <h2>Product Email Sent</h2>
        <p><strong>Recipient:</strong> ${email}</p>
        <p><strong>Product Code:</strong> ${productCode}</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `;

    try {
      const userResult = await this.sendEmail({
        to: email,
        cc: process.env.SMTP_CC,
        subject: `Product Information: ${formattedProductCode}`,
        htmlBody: userHtml
      });

      const adminResult = await this.sendEmail({
        to: adminEmail,
        cc: process.env.SMTP_CC,
        subject: `Product Email Sent: ${formattedProductCode} to ${email}`,
        htmlBody: adminHtml
      });
      
      console.log('Product email sent to user:', userResult.messageId);
      console.log('Admin notification sent:', adminResult.messageId);
      
      return {
        success: true,
        userMessageId: userResult.messageId,
        adminMessageId: adminResult.messageId
      };
    } catch (error) {
      console.error('Failed to send product email:', error);
      throw new Error(`Product email sending failed: ${error.message}`);
    }
  }

  async sendCustomEmail(to, subject, htmlContent, textContent = null) {
    try {
      const result = await this.sendEmail({
        to,
        subject,
        htmlBody: htmlContent,
        textBody: textContent
      });
      
      console.log('Custom email sent:', result.messageId);
      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      console.error('Failed to send custom email:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
}

module.exports = new EmailService();