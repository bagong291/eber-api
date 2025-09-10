const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    // Configure SMTP transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      }
    });
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('SMTP connection verification failed:', error);
      return false;
    }
  }

  async sendFormSubmissionNotification(formData) {
    const { firstName, lastName, email, phone, company, subject, message, formType } = formData;
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@company.com';
    const companyName = process.env.COMPANY_NAME || 'Your Company';
    const websiteUrl = process.env.WEBSITE_URL || 'https://yourcompany.com';
    const productListUrl = `${websiteUrl}/products`;

    // Email to admin
    const adminMailOptions = {
      from: `"${companyName} Contact Form" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      cc: process.env.SMTP_CC ,
      subject: `New ${formType} submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Form Submission - ${formType.charAt(0).toUpperCase() + formType.slice(1)}
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message Details</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="margin-top: 15px;">
              <strong>Message:</strong>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 3px; margin-top: 10px; white-space: pre-wrap;">${message}</div>
            </div>
          </div>
          
          <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #0056b3;">
              <strong>Submission Time:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    };

    // Auto-response email to user
    const userMailOptions = {
      from: `"${companyName}" <${process.env.SMTP_USER}>`,
      to: email,
      cc: process.env.SMTP_CC ,
      subject: `Thank you for contacting ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Thank You for Your ${formType.charAt(0).toUpperCase() + formType.slice(1)}
          </h2>
          
          <p>Dear ${firstName} ${lastName},</p>
          
          <p>Thank you for reaching out to us! We have received your ${formType} and will get back to you within 24-48 hours.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Submission Summary</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #e7f3ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #0056b3; margin-top: 0;">Explore Our Products</h3>
            <p>While you wait for our response, feel free to browse our complete product catalog:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${productListUrl}" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                View Our Products
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">
              <a href="${productListUrl}" style="color: #007bff;">${productListUrl}</a>
            </p>
          </div>
          
          <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; color: #666; font-size: 14px;">
            <p>Best regards,<br>
            The ${companyName} Team</p>
            
            <p>If you have any urgent questions, please don't hesitate to contact us directly.</p>
          </div>
        </div>
      `
    };

    try {
      // Send both emails
      const adminResult = await this.transporter.sendMail(adminMailOptions);
      const userResult = await this.transporter.sendMail(userMailOptions);
      
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
    
    // Create base64 encoded user data for the product link
    const userData = {
      name: fullName,
      email: email,
      timestamp: new Date().toISOString()
    };
    const encodedUserData = Buffer.from(JSON.stringify(userData)).toString('base64');
    const productListUrl = `${websiteUrl}/product?access=${encodedUserData}`;

    // Email to admin
    const adminMailOptions = {
      from: `"${companyName} Instant Access" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      cc: process.env.SMTP_CC ,
      subject: `New Instant Access Request from ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Instant Access Request
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            ${city ? `<p><strong>City:</strong> ${city}</p>` : ''}
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border: 1px solid #ffeaa7; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">Action Required</h3>
            <p style="margin: 0; color: #856404;">
              <strong>User is requesting instant access to the product catalog.</strong>
            </p>
            <p style="font-size: 14px; color: #856404; margin-top: 10px;">
              Personalized link sent: <a href="${productListUrl}" style="color: #007bff;">${productListUrl}</a>
            </p>
          </div>
          
          <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #0056b3;">
              <strong>Submission Time:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    };

    // Auto-response email to user with personalized product list link
    const userMailOptions = {
      from: `"${companyName}" <${process.env.SMTP_USER}>`,
      to: email,
      cc: process.env.SMTP_CC ,
      subject: `Welcome! Your Instant Access to ${companyName} Products`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Welcome to ${companyName}!
          </h2>
          
          <p>Dear ${fullName},</p>
          
          <p>Thank you for requesting instant access to our product catalog! We're excited to share our complete range of products with you.</p>
          
          <div style="background: #d4edda; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #c3e6cb;">
            <h3 style="color: #155724; margin-top: 0;">🎉 Access Granted!</h3>
            <p style="color: #155724; margin-bottom: 15px;">Your personalized instant access to our product catalog is ready. Click the button below to explore our full range:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${productListUrl}" 
                 style="background: #28a745; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
                🛍️ View Product Catalog
              </a>
            </div>
            <p style="font-size: 12px; color: #155724; text-align: center; margin: 0;">
              This link is personalized for you and tracks your access for better service.
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>Browse our complete product range</li>
              <li>Download product specifications and datasheets</li>
              <li>Contact us for pricing and availability</li>
              <li>Request samples or demos</li>
            </ul>
          </div>
          
          <div style="background: #e7f3ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #0056b3; margin-top: 0;">Need Help?</h3>
            <p style="color: #666;">Our team is here to assist you. Feel free to reach out with any questions about our products or services.</p>
            <p style="font-size: 14px; color: #666;">
              📧 Email us directly at this address<br>
              📞 Call us: ${phone ? 'We\'ll contact you soon!' : 'Contact details on our website'}
            </p>
          </div>
          
          <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; color: #666; font-size: 14px;">
            <p>Best regards,<br>
            The ${companyName} Team</p>
            
            <p style="font-size: 12px; color: #999;">
              Your personalized link: <a href="${productListUrl}" style="color: #007bff; word-break: break-all;">${productListUrl}</a>
            </p>
          </div>
        </div>
      `
    };

    try {
      // Send both emails
      const adminResult = await this.transporter.sendMail(adminMailOptions);
      const userResult = await this.transporter.sendMail(userMailOptions);
      
      console.log('Admin instant access notification sent:', adminResult.messageId);
      console.log('User instant access response sent:', userResult.messageId);
      console.log(email)
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
    
    // Format product name from code (e.g., ETA_01 -> ETA 01)
    const formattedProductCode = productCode.replace('_', ' ');
    
    // Professional email template
    const userMailOptions = {
      from: `"${companyName}" <${process.env.SMTP_USER}>`,
      to: email,
      cc: process.env.SMTP_CC ,
      subject: `Product Information: ${formattedProductCode}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">${companyName}</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Professional Product Solutions</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; font-size: 24px; margin: 0 0 10px 0; font-weight: 600;">Dear Friends,</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0;">Thank you so much for your interest in our product.</p>
            </div>
            
            <!-- Product Information -->
            <div style="background: #f8f9ff; border-left: 4px solid #667eea; padding: 25px; margin: 30px 0; border-radius: 0 8px 8px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">Product Details</h3>
              <div style="color: #555; font-size: 16px; line-height: 1.6;">
                <p style="margin: 0 0 10px 0;"><strong>Product Code:</strong> ${formattedProductCode}</p>
                ${productData?.application_en ? `<p style="margin: 0 0 10px 0;"><strong>Application:</strong> ${productData.application_en}</p>` : ''}
                ${productData?.type ? `<p style="margin: 0 0 10px 0;"><strong>Type:</strong> ${productData.type}</p>` : ''}
                ${productData?.performanceFeature_en ? `<div style="margin: 15px 0 0 0;"><strong>Performance Features:</strong><div style="background: white; padding: 15px; border-radius: 6px; margin-top: 8px; border: 1px solid #e0e6ed;">${productData.performanceFeature_en}</div></div>` : ''}
              </div>
            </div>
            
            <!-- Support Message -->
            <div style="background: #fff7e6; border: 1px solid #ffd56b; border-radius: 8px; padding: 25px; margin: 30px 0;">
              <h3 style="color: #b8860b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">How can we assist you with your needs for ${formattedProductCode}?</h3>
              <p style="color: #8b6914; margin: 0; font-size: 16px; line-height: 1.6;">We're here and delighted to help you.</p>
            </div>
            
            <!-- Call to Action -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${websiteUrl}/product?code=${productCode}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 600; font-size: 16px; transition: transform 0.2s ease; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                📋 View Complete Product Details
              </a>
            </div>
            
            <!-- Additional Information -->
            <div style="background: #f0f7ff; border-radius: 8px; padding: 25px; margin: 30px 0;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Next Steps</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Review detailed product specifications</li>
                <li>Request a personalized quote</li>
                <li>Schedule a technical consultation</li>
                <li>Request product samples or demonstrations</li>
              </ul>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 30px; border-top: 1px solid #e9ecef;">
            <div style="text-align: center;">
              <p style="color: #6c757d; margin: 0 0 15px 0; font-size: 16px; font-weight: 500;">With warmest regards,</p>
              <p style="color: #495057; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">The ${companyName} Team</p>
              
              <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 25px;">
                <p style="color: #6c757d; margin: 0; font-size: 14px; line-height: 1.5;">
                  This email was sent in response to your product inquiry.<br>
                  For immediate assistance, please contact us directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      `
    };

    // Admin notification email
    const adminMailOptions = {
      from: `"${companyName} Product Inquiry" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      cc: process.env.SMTP_CC ,
      subject: `Product Email Sent: ${formattedProductCode} to ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Product Email Notification
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Email Details</h3>
            <p><strong>Recipient:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Product Code:</strong> ${productCode}</p>
            <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          ${productData ? `
          <div style="background: #e7f3ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #0056b3; margin-top: 0;">Product Information Sent</h3>
            <p><strong>Application:</strong> ${productData.application_en || 'N/A'}</p>
            <p><strong>Type:</strong> ${productData.type || 'N/A'}</p>
            ${productData.performanceFeature_en ? `<p><strong>Features:</strong> ${productData.performanceFeature_en.substring(0, 100)}...</p>` : ''}
          </div>
          ` : ''}
        </div>
      `
    };

    try {
      // Send both emails
      const userResult = await this.transporter.sendMail(userMailOptions);
      const adminResult = await this.transporter.sendMail(adminMailOptions);
      
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
    const companyName = process.env.COMPANY_NAME || 'Your Company';
    
    const mailOptions = {
      from: `"${companyName}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
      text: textContent
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
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