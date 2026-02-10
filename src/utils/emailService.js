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

  async sendEmail({ to, subject, htmlBody, textBody, cc, attachments = [] }) {
    try {
      const formData = new FormData();
      formData.append('from_email', this.fromEmail);
      formData.append('to', to);
      if (cc) formData.append('cc', cc);
      formData.append('subject', subject);
      formData.append('body', htmlBody || textBody);
      formData.append('is_html', htmlBody ? 'true' : 'false');

      // Add attachments if provided
      if (attachments && attachments.length > 0) {
        for (const attachment of attachments) {
          if (attachment.buffer) {
            // From buffer
            formData.append('attachments', attachment.buffer, attachment.filename);
          } else if (attachment.path) {
            // From file path
            const fs = require('fs');
            formData.append('attachments', fs.createReadStream(attachment.path), attachment.filename || attachment.originalname);
          }
        }
      }

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
    const headerImageUrl = `${process.env.HEADER_URL}/uploads/header.png`;
    const productListUrl = `${websiteUrl}/products`;

    // Email to admin
    const adminHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 8px;">
            <img src="${headerImageUrl}" alt="${companyName}" style="max-width: 100%; height: auto; display: block;"/>
          </div>
          <div style="padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">New ${formType}</div>
              <h2 style="color: #1a202c; font-size: 26px; margin: 0; font-weight: 700; line-height: 1.3;">Form Submission Received</h2>
            </div>
            <div style="background: linear-gradient(135deg, #f6f8fb 0%, #e9ecf5 100%); border-radius: 12px; padding: 24px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
              <h3 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">📋 Contact Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Name:</strong></td><td style="padding: 8px 0; color: #1a202c; font-size: 14px;">${firstName} ${lastName}</td></tr>
                <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-size: 14px;">${email}</a></td></tr>
                ${phone ? `<tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Phone:</strong></td><td style="padding: 8px 0; color: #1a202c; font-size: 14px;">${phone}</td></tr>` : ''}
                ${company ? `<tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Company:</strong></td><td style="padding: 8px 0; color: #1a202c; font-size: 14px;">${company}</td></tr>` : ''}
              </table>
            </div>
            <div style="background: #fff; border: 2px solid #ffd56b; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
              <h3 style="color: #744210; margin: 0 0 12px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">💬 Message</h3>
              <div style="color: #2d3748; font-size: 14px; font-weight: 600; margin-bottom: 8px;">${subject}</div>
              <div style="background: #fafafa; padding: 16px; border-radius: 8px; color: #4a5568; font-size: 14px; line-height: 1.6; white-space: pre-wrap; border-left: 3px solid #ffd56b;">${message}</div>
            </div>
            <div style="text-align: center; padding: 16px; background: #f7fafc; border-radius: 8px;">
              <div style="color: #718096; font-size: 13px;">⏰ Submitted on ${new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // User auto-response
    const userHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 8px;">
            <img src="${headerImageUrl}" alt="${companyName}" style="max-width: 100%; height: auto; display: block;"/>
          </div>
          <div style="padding: 40px 28px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="font-size: 48px; line-height: 1; margin-bottom: 16px;">✨</div>
              <h2 style="color: #1a202c; font-size: 28px; margin: 0 0 12px 0; font-weight: 700; line-height: 1.2;">Thank You!</h2>
              <p style="color: #4a5568; font-size: 16px; margin: 0; line-height: 1.5;">Hi ${firstName}, we've received your message</p>
            </div>
            <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #667eea;">
              <div style="color: #5a67d8; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">⚡ Quick Response</div>
              <p style="color: #2d3748; font-size: 15px; margin: 0; line-height: 1.6;">Our team will review your message and get back to you within <strong>24-48 hours</strong>. We appreciate your patience!</p>
            </div>
            <div style="background: #f7fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h3 style="color: #2d3748; margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">📝 Your Submission</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #718096; font-size: 13px;">Subject</td><td style="padding: 6px 0; color: #2d3748; font-size: 13px; font-weight: 600;">${subject}</td></tr>
                <tr><td style="padding: 6px 0; color: #718096; font-size: 13px;">Date</td><td style="padding: 6px 0; color: #2d3748; font-size: 13px; font-weight: 600;">${new Date().toLocaleString()}</td></tr>
              </table>
            </div>
            <div style="background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%); border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 32px; margin-bottom: 12px;">🛍️</div>
              <h3 style="color: #744210; margin: 0 0 8px 0; font-size: 18px; font-weight: 700;">Explore Our Products</h3>
              <p style="color: #975a16; margin: 0 0 20px 0; font-size: 14px; line-height: 1.5;">Discover our complete catalog while you wait</p>
              <a href="${productListUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); transition: all 0.3s;">View Product Catalog</a>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%); padding: 28px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; margin: 0 0 8px 0; font-size: 14px; line-height: 1.5;">Best regards,</p>
            <p style="color: #2d3748; margin: 0; font-size: 17px; font-weight: 700;">${companyName} Team</p>
          </div>
        </div>
      </body>
      </html>
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
    const headerImageUrl =`${process.env.HEADER_URL}/uploads/header.png`;
    
    const userData = {
      name: fullName,
      email: email,
      timestamp: new Date().toISOString()
    };
    const encodedUserData = Buffer.from(JSON.stringify(userData)).toString('base64');
    const productListUrl = `${websiteUrl}/product?access=${encodedUserData}`;

    const adminHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 8px;">
            <img src="${headerImageUrl}" alt="${companyName}" style="max-width: 100%; height: auto; display: block;"/>
          </div>
          <div style="padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">Instant Access</div>
              <h2 style="color: #1a202c; font-size: 24px; margin: 0; font-weight: 700;">New Request</h2>
            </div>
            <div style="background: linear-gradient(135deg, #f6f8fb 0%, #e9ecf5 100%); border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
              <h3 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">📋 Contact Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Name:</strong></td><td style="padding: 8px 0; color: #1a202c; font-size: 14px;">${fullName}</td></tr>
                <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-size: 14px;">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Phone:</strong></td><td style="padding: 8px 0; color: #1a202c; font-size: 14px;">${phone}</td></tr>
                ${company ? `<tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Company:</strong></td><td style="padding: 8px 0; color: #1a202c; font-size: 14px;">${company}</td></tr>` : ''}
                ${city ? `<tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>City:</strong></td><td style="padding: 8px 0; color: #1a202c; font-size: 14px;">${city}</td></tr>` : ''}
              </table>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const userHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 8px;">
            <img src="${headerImageUrl}" alt="${companyName}" style="max-width: 100%; height: auto; display: block;"/>
          </div>
          <div style="padding: 40px 28px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="font-size: 48px; line-height: 1; margin-bottom: 16px;">🎉</div>
              <h2 style="color: #1a202c; font-size: 28px; margin: 0 0 12px 0; font-weight: 700; line-height: 1.2;">Welcome, ${fullName}!</h2>
              <p style="color: #4a5568; font-size: 16px; margin: 0; line-height: 1.5;">Your instant access is ready</p>
            </div>
            <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 100%); border-radius: 12px; padding: 24px; margin-bottom: 28px; border-left: 4px solid #667eea;">
              <div style="color: #5a67d8; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">✅ Access Granted</div>
              <p style="color: #2d3748; font-size: 15px; margin: 0; line-height: 1.6;">Thank you for requesting access to our product catalog! Click the button below to explore our complete collection.</p>
            </div>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${productListUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); transition: all 0.3s;">🛍️ View Product Catalog</a>
            </div>
            <div style="background: #f7fafc; border-radius: 12px; padding: 20px; text-align: center;">
              <p style="color: #718096; font-size: 13px; margin: 0; line-height: 1.5;">💡 Explore our products anytime with this exclusive link</p>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%); padding: 28px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; margin: 0 0 8px 0; font-size: 14px; line-height: 1.5;">Best regards,</p>
            <p style="color: #2d3748; margin: 0; font-size: 17px; font-weight: 700;">${companyName} Team</p>
          </div>
        </div>
      </body>
      </html>
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
    const headerImageUrl =`${process.env.HEADER_URL}/uploads/header.png`;
    
    const formattedProductCode = productCode.replace('_', ' ');
    
    const userHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 8px;">
            <img src="${headerImageUrl}" alt="${companyName}" style="max-width: 100%; height: auto; display: block;"/>
          </div>
          <div style="padding: 40px 28px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="font-size: 48px; line-height: 1; margin-bottom: 16px;">👋</div>
              <h2 style="color: #1a202c; font-size: 28px; margin: 0 0 12px 0; font-weight: 700; line-height: 1.2;">Hello, Friend!</h2>
              <p style="color: #4a5568; font-size: 16px; margin: 0; line-height: 1.5;">Thank you for your interest in our products</p>
            </div>
            <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 100%); border-radius: 12px; padding: 28px; margin-bottom: 24px; border-left: 4px solid #667eea;">
              <div style="color: #5a67d8; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">🎯 Product Information</div>
              <div style="background: #ffffff; border-radius: 8px; padding: 20px; margin-bottom: 12px;">
                <div style="color: #2d3748; font-size: 13px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Product Code</div>
                <div style="color: #1a202c; font-size: 18px; font-weight: 700; margin-bottom: 16px;">${formattedProductCode}</div>
                ${productData?.application_en ? `
                  <div style="color: #2d3748; font-size: 13px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 16px;">Application</div>
                  <div style="color: #4a5568; font-size: 15px; line-height: 1.6;">${productData.application_en}</div>
                ` : ''}
                ${productData?.type ? `
                  <div style="color: #2d3748; font-size: 13px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 16px;">Type</div>
                  <div style="color: #4a5568; font-size: 15px;">${productData.type}</div>
                ` : ''}
              </div>
              ${productData?.performanceFeature_en ? `
                <div style="background: #ffffff; border-radius: 8px; padding: 20px;">
                  <div style="color: #2d3748; font-size: 13px; font-weight: 600; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">✨ Performance Features</div>
                  <div style="color: #4a5568; font-size: 14px; line-height: 1.6;">${productData.performanceFeature_en}</div>
                </div>
              ` : ''}
            </div>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${websiteUrl}/product?code=${productCode}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); transition: all 0.3s;">📖 View Complete Details</a>
            </div>
            <div style="background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%); border-radius: 12px; padding: 20px; text-align: center;">
              <p style="color: #975a16; font-size: 13px; margin: 0; line-height: 1.5;">💡 Need more information? Feel free to contact us anytime</p>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%); padding: 28px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; margin: 0 0 8px 0; font-size: 14px; line-height: 1.5;">Best regards,</p>
            <p style="color: #2d3748; margin: 0; font-size: 17px; font-weight: 700;">${companyName} Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const adminHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">✅ Email Sent</div>
            <h2 style="color: #1a202c; font-size: 24px; margin: 0; font-weight: 700;">Product Email Delivered</h2>
          </div>
          <div style="background: linear-gradient(135deg, #f6f8fb 0%, #e9ecf5 100%); border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Recipient:</strong></td><td style="padding: 8px 0; color: #1a202c; font-size: 14px;">${email}</td></tr>
              <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Product Code:</strong></td><td style="padding: 8px 0; color: #1a202c; font-size: 14px;">${productCode}</td></tr>
              <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Sent at:</strong></td><td style="padding: 8px 0; color: #1a202c; font-size: 14px;">${new Date().toLocaleString()}</td></tr>
            </table>
          </div>
        </div>
      </body>
      </html>
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

  async sendCareerApplicationEmail(formData, fileAttachment) {
    const { firstName, lastName, email, message } = formData;
    
    const hrEmail = process.env.HR_EMAIL || 'hr@company.com';
    const companyName = process.env.COMPANY_NAME || 'Your Company';
    const headerImageUrl = `${process.env.HEADER_URL}/uploads/header.png`;
    
    // Email to HR with attachment
    const hrHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 8px;">
            <img src="${headerImageUrl}" alt="${companyName}" style="max-width: 100%; height: auto; display: block;"/>
          </div>
          <div style="padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">💼 Career Application</div>
              <h2 style="color: #1a202c; font-size: 26px; margin: 0; font-weight: 700; line-height: 1.3;">New Applicant</h2>
            </div>
            <div style="background: linear-gradient(135deg, #f6f8fb 0%, #e9ecf5 100%); border-radius: 12px; padding: 24px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
              <h3 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">👤 Applicant Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Name:</strong></td><td style="padding: 8px 0; color: #1a202c; font-size: 14px;">${firstName} ${lastName}</td></tr>
                <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-size: 14px;">${email}</a></td></tr>
              </table>
            </div>
            <div style="background: #fff; border: 2px solid #ffd56b; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
              <h3 style="color: #744210; margin: 0 0 12px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">📝 Cover Letter</h3>
              <div style="background: #fafafa; padding: 16px; border-radius: 8px; color: #4a5568; font-size: 14px; line-height: 1.6; white-space: pre-wrap; border-left: 3px solid #ffd56b;">${message}</div>
            </div>
            ${fileAttachment ? `<div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 8px;">📎</div>
              <p style="margin: 0; color: #065f46; font-size: 15px; font-weight: 600;">${fileAttachment.originalname}</p>
              <p style="margin: 4px 0 0 0; color: #047857; font-size: 13px;">Resume attached to this email</p>
            </div>` : ''}
            <div style="text-align: center; padding: 16px; background: #f7fafc; border-radius: 8px;">
              <div style="color: #718096; font-size: 13px;">⏰ Submitted on ${new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email to applicant (confirmation)
    const applicantHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 8px;">
            <img src="${headerImageUrl}" alt="${companyName}" style="max-width: 100%; height: auto; display: block;"/>
          </div>
          <div style="padding: 40px 28px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="font-size: 48px; line-height: 1; margin-bottom: 16px;">🎉</div>
              <h2 style="color: #1a202c; font-size: 28px; margin: 0 0 12px 0; font-weight: 700; line-height: 1.2;">Application Received!</h2>
              <p style="color: #4a5568; font-size: 16px; margin: 0; line-height: 1.5;">Hi ${firstName}, thank you for applying</p>
            </div>
            <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #667eea;">
              <div style="color: #5a67d8; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">✅ Confirmation</div>
              <p style="color: #2d3748; font-size: 15px; margin: 0; line-height: 1.6;">Thank you for your interest in joining our team at ${companyName}. We've successfully received your application and resume.</p>
            </div>
            <div style="background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%); border-radius: 12px; padding: 28px; margin-bottom: 24px;">
              <h3 style="color: #744210; margin: 0 0 16px 0; font-size: 18px; font-weight: 700; text-align: center;">📅 What Happens Next?</h3>
              <div style="color: #975a16; font-size: 14px; line-height: 2;">
                <div style="background: #ffffff; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px; display: flex; align-items: center;">
                  <span style="font-size: 20px; margin-right: 12px;">1️⃣</span>
                  <span>Our HR team reviews your application</span>
                </div>
                <div style="background: #ffffff; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px; display: flex; align-items: center;">
                  <span style="font-size: 20px; margin-right: 12px;">2️⃣</span>
                  <span>We'll contact you if your profile matches</span>
                </div>
              </div>
            </div>
            <div style="background: #f7fafc; border-radius: 12px; padding: 20px; text-align: center;">
              <p style="color: #4a5568; font-size: 14px; margin: 0; line-height: 1.6;">💪 We appreciate your patience and wish you the best of luck!</p>
            </div>
          </div>
          <div style="background: linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%); padding: 28px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; margin: 0 0 8px 0; font-size: 14px; line-height: 1.5;">Best regards,</p>
            <p style="color: #2d3748; margin: 0; font-size: 17px; font-weight: 700;">HR Team - ${companyName}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const attachments = fileAttachment ? [fileAttachment] : [];
      
      // Send to HR with attachment
      const hrResult = await this.sendEmail({
        to: hrEmail,
        cc: process.env.SMTP_CC,
        subject: `New Career Application from ${firstName} ${lastName}`,
        htmlBody: hrHtml,
        attachments
      });

      // Send confirmation to applicant (no attachment)
      const applicantResult = await this.sendEmail({
        to: email,
        subject: `Application Received - ${companyName}`,
        htmlBody: applicantHtml
      });
      
      console.log('HR notification sent:', hrResult.messageId);
      console.log('Applicant confirmation sent:', applicantResult.messageId);
      
      return {
        success: true,
        hrMessageId: hrResult.messageId,
        applicantMessageId: applicantResult.messageId
      };
    } catch (error) {
      console.error('Failed to send career application emails:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  async sendContactFormEmail(formData) {
    const { firstName, lastName, email, message } = formData;
    
    // Parse contact emails (support multiple comma-separated emails)
    const contactEmailsStr = process.env.CONTACT_EMAIL_TO || 'contact@company.com';
    const contactEmails = contactEmailsStr.split(',').map(e => e.trim()).filter(e => e);
    const primaryContactEmail = contactEmails[0];
    const ccEmails = contactEmails.slice(1).join(',');
    
    const companyName = process.env.COMPANY_NAME || 'Your Company';
    const headerImageUrl = `${process.env.HEADER_URL}/uploads/header.png`;
    
    // Email to contact team
    const contactHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 8px;">
            <img src="${headerImageUrl}" alt="${companyName}" style="max-width: 100%; height: auto; display: block;"/>
          </div>
          <div style="padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">💬 Contact Form</div>
              <h2 style="color: #1a202c; font-size: 26px; margin: 0; font-weight: 700; line-height: 1.3;">New Message Received</h2>
            </div>
            <div style="background: linear-gradient(135deg, #f6f8fb 0%, #e9ecf5 100%); border-radius: 12px; padding: 24px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
              <h3 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">📋 Contact Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Name:</strong></td><td style="padding: 8px 0; color: #1a202c; font-size: 14px;">${firstName} ${lastName}</td></tr>
                <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-size: 14px;">${email}</a></td></tr>
              </table>
            </div>
            <div style="background: #fff; border: 2px solid #ffd56b; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
              <h3 style="color: #744210; margin: 0 0 12px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">💬 Message</h3>
              <div style="background: #fafafa; padding: 16px; border-radius: 8px; color: #4a5568; font-size: 14px; line-height: 1.6; white-space: pre-wrap; border-left: 3px solid #ffd56b;">${message}</div>
            </div>
            <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 100%); border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
              <h3 style="color: #5a67d8; margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">🔗 Quick Actions</h3>
              <a href="mailto:${email}?subject=Re: Your message to ${companyName}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">📧 Reply to ${firstName}</a>
            </div>
            <div style="text-align: center; padding: 16px; background: #f7fafc; border-radius: 8px;">
              <div style="color: #718096; font-size: 13px;">⏰ Received on ${new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      // Send to contact team (with CC if multiple emails)
      const contactResult = await this.sendEmail({
        to: primaryContactEmail,
        cc: ccEmails || process.env.SMTP_CC,
        subject: `Contact Request - ${firstName} ${lastName}`,
        htmlBody: contactHtml
      });
      
      console.log('Contact form notification sent to:', contactEmailsStr);
      console.log('Message ID:', contactResult.messageId);
      
      return {
        success: true,
        messageId: contactResult.messageId,
        recipients: contactEmails
      };
    } catch (error) {
      console.error('Failed to send contact form email:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  async sendUnifiedEmail(emailData) {
    const { firstName, lastName, email, message, type, config } = emailData;
    
    // Parse recipient emails (support multiple comma-separated emails)
    const recipientEmailsStr = process.env[config.envKey] || config.defaultEmail;
    const recipientEmails = recipientEmailsStr.split(',').map(e => e.trim()).filter(e => e);
    const primaryEmail = recipientEmails[0];
    const ccEmails = recipientEmails.slice(1).join(',');
    
    const companyName = process.env.COMPANY_NAME || 'Your Company';
    const headerImageUrl = `${process.env.HEADER_URL}/uploads/header.png`;
    
    // Generate email HTML with dynamic badge and title
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 8px;">
            <img src="${headerImageUrl}" alt="${companyName}" style="max-width: 100%; height: auto; display: block;"/>
          </div>
          <div style="padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">${config.badge}</div>
              <h2 style="color: #1a202c; font-size: 26px; margin: 0; font-weight: 700; line-height: 1.3;">${config.title}</h2>
            </div>
            <div style="background: linear-gradient(135deg, #f6f8fb 0%, #e9ecf5 100%); border-radius: 12px; padding: 24px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
              <h3 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">📋 Contact Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Name:</strong></td><td style="padding: 8px 0; color: #1a202c; font-size: 14px;">${firstName} ${lastName}</td></tr>
                <tr><td style="padding: 8px 0; color: #4a5568; font-size: 14px;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-size: 14px;">${email}</a></td></tr>
              </table>
            </div>
            <div style="background: #fff; border: 2px solid #ffd56b; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
              <h3 style="color: #744210; margin: 0 0 12px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">💬 Message</h3>
              <div style="background: #fafafa; padding: 16px; border-radius: 8px; color: #4a5568; font-size: 14px; line-height: 1.6; white-space: pre-wrap; border-left: 3px solid #ffd56b;">${message}</div>
            </div>
            <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 100%); border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
              <h3 style="color: #5a67d8; margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">🔗 Quick Actions</h3>
              <a href="mailto:${email}?subject=Re: Your message to ${companyName}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">📧 Reply to ${firstName}</a>
            </div>
            <div style="text-align: center; padding: 16px; background: #f7fafc; border-radius: 8px;">
              <div style="color: #718096; font-size: 13px;">⏰ Received on ${new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      // Send email to recipients
      const result = await this.sendEmail({
        to: primaryEmail,
        cc: ccEmails || process.env.SMTP_CC,
        subject: config.subject(firstName, lastName),
        htmlBody: emailHtml
      });
      
      console.log(`${type} email sent to:`, recipientEmailsStr);
      console.log('Message ID:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        recipients: recipientEmails,
        type
      };
    } catch (error) {
      console.error(`Failed to send ${type} email:`, error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
}

module.exports = new EmailService();