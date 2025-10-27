import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import logger from '../utils/logger';
import { ApiError } from '../middleware/errorHandler';

const OAuth2 = google.auth.OAuth2;

/**
 * Email Service using Gmail API
 */
export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  /**
   * Initialize Gmail OAuth2 transporter
   */
  private static async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) {
      return this.transporter;
    }

    try {
      const oauth2Client = new OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        process.env.GMAIL_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      });

      const accessToken = await oauth2Client.getAccessToken();

      if (!accessToken.token) {
        throw new ApiError('Failed to obtain Gmail access token', 500);
      }

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.GMAIL_FROM_EMAIL,
          clientId: process.env.GMAIL_CLIENT_ID,
          clientSecret: process.env.GMAIL_CLIENT_SECRET,
          refreshToken: process.env.GMAIL_REFRESH_TOKEN,
          accessToken: accessToken.token,
        },
      } as any);

      logger.info('Gmail transporter initialized successfully');
      return this.transporter;
    } catch (error) {
      logger.error('Failed to initialize Gmail transporter:', error);
      throw new ApiError('Failed to initialize email service', 500);
    }
  }

  /**
   * Send team invitation email
   */
  static async sendTeamInvitation(
    recipientEmail: string,
    recipientName: string,
    inviterName: string,
    organizationName: string,
    invitationLink: string
  ): Promise<boolean> {
    try {
      // Check if email notifications are enabled
      if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'true') {
        logger.warn('Email notifications are disabled');
        return false;
      }

      // Validate required parameters
      if (!recipientEmail || recipientEmail.trim().length === 0) {
        throw new ApiError('Recipient email is required', 400);
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipientEmail)) {
        throw new ApiError('Invalid email format', 400);
      }

      if (!recipientName || recipientName.trim().length === 0) {
        throw new ApiError('Recipient name is required', 400);
      }

      if (!inviterName || inviterName.trim().length === 0) {
        throw new ApiError('Inviter name is required', 400);
      }

      if (!organizationName || organizationName.trim().length === 0) {
        throw new ApiError('Organization name is required', 400);
      }

      if (!invitationLink || invitationLink.trim().length === 0) {
        throw new ApiError('Invitation link is required', 400);
      }

      const transporter = await this.getTransporter();

      const mailOptions = {
        from: `Zoddy <${process.env.GMAIL_FROM_EMAIL}>`,
        to: recipientEmail,
        subject: `You've been invited to join ${organizationName} on Zoddy`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Team Invitation</h1>
              </div>
              <div class="content">
                <p>Hi ${recipientName},</p>
                <p><strong>${inviterName}</strong> has invited you to join <strong>${organizationName}</strong> on Zoddy!</p>
                <p>Zoddy is a business management platform designed for small businesses in Bangladesh. You'll be able to collaborate with your team on:</p>
                <ul>
                  <li>📦 Order management</li>
                  <li>👥 Customer relationship tracking</li>
                  <li>📊 Inventory management</li>
                  <li>📈 Business analytics</li>
                  <li>✅ Team tasks and collaboration</li>
                </ul>
                <p>Click the button below to accept the invitation and get started:</p>
                <center>
                  <a href="${invitationLink}" class="button">Accept Invitation</a>
                </center>
                <p style="color: #666; font-size: 14px;">This invitation link will expire in 7 days.</p>
                <p>If you didn't expect this invitation, you can safely ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Zoddy. All rights reserved.</p>
                <p>Made with ❤️ for Bangladeshi businesses</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);
      logger.info(`Team invitation email sent to ${recipientEmail}`);

      return true;
    } catch (error) {
      logger.error('Failed to send team invitation email:', error);
      throw new ApiError('Failed to send invitation email', 500);
    }
  }

  /**
   * Send payment reminder email
   */
  static async sendPaymentReminder(
    customerEmail: string,
    customerName: string,
    orderId: string,
    amount: number,
    dueDate: string
  ): Promise<boolean> {
    try {
      // Check if email notifications are enabled
      if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'true') {
        logger.warn('Email notifications are disabled');
        return false;
      }

      // Validate required parameters
      if (!customerEmail || customerEmail.trim().length === 0) {
        throw new ApiError('Customer email is required', 400);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        throw new ApiError('Invalid email format', 400);
      }

      if (!customerName || customerName.trim().length === 0) {
        throw new ApiError('Customer name is required', 400);
      }

      if (!orderId || orderId.trim().length === 0) {
        throw new ApiError('Order ID is required', 400);
      }

      if (!amount || amount <= 0) {
        throw new ApiError('Amount must be greater than 0', 400);
      }

      if (!dueDate || dueDate.trim().length === 0) {
        throw new ApiError('Due date is required', 400);
      }

      const transporter = await this.getTransporter();

      const mailOptions = {
        from: `Zoddy <${process.env.GMAIL_FROM_EMAIL}>`,
        to: customerEmail,
        subject: `Payment Reminder: Order #${orderId}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f39c12; color: white; padding: 20px; text-align: center; }
              .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
              .amount { font-size: 24px; color: #667eea; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>💰 Payment Reminder</h2>
              </div>
              <div class="content">
                <p>Dear ${customerName},</p>
                <p>This is a friendly reminder that you have a pending payment for Order <strong>#${orderId}</strong>.</p>
                <p>Amount Due: <span class="amount">৳${amount.toLocaleString('bn-BD')}</span></p>
                <p>Due Date: <strong>${dueDate}</strong></p>
                <p>Please complete your payment at your earliest convenience.</p>
                <p>If you've already paid, please disregard this message.</p>
                <p>Thank you for your business!</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);
      logger.info(`Payment reminder email sent to ${customerEmail}`);

      return true;
    } catch (error) {
      logger.error('Failed to send payment reminder email:', error);
      return false;
    }
  }

  /**
   * Send order confirmation email
   */
  static async sendOrderConfirmation(
    customerEmail: string,
    customerName: string,
    orderId: string,
    orderDetails: any
  ): Promise<boolean> {
    try {
      // Check if email notifications are enabled
      if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'true') {
        logger.warn('Email notifications are disabled');
        return false;
      }

      // Validate required parameters
      if (!customerEmail || customerEmail.trim().length === 0) {
        throw new ApiError('Customer email is required', 400);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        throw new ApiError('Invalid email format', 400);
      }

      if (!customerName || customerName.trim().length === 0) {
        throw new ApiError('Customer name is required', 400);
      }

      if (!orderId || orderId.trim().length === 0) {
        throw new ApiError('Order ID is required', 400);
      }

      if (!orderDetails || typeof orderDetails !== 'object') {
        throw new ApiError('Order details must be provided', 400);
      }

      if (!Array.isArray(orderDetails.items) || orderDetails.items.length === 0) {
        throw new ApiError('Order must contain at least one item', 400);
      }

      if (!orderDetails.total_amount || orderDetails.total_amount <= 0) {
        throw new ApiError('Order total amount must be greater than 0', 400);
      }

      const transporter = await this.getTransporter();

      const itemsHtml = orderDetails.items
        .map(
          (item: any) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>৳${item.price.toLocaleString('bn-BD')}</td>
            <td>৳${(item.quantity * item.price).toLocaleString('bn-BD')}</td>
          </tr>
        `
        )
        .join('');

      const mailOptions = {
        from: `Zoddy <${process.env.GMAIL_FROM_EMAIL}>`,
        to: customerEmail,
        subject: `Order Confirmation: #${orderId}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
              .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background: #f4f4f4; }
              .total { font-size: 20px; font-weight: bold; color: #667eea; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>✅ Order Confirmed!</h2>
              </div>
              <div class="content">
                <p>Dear ${customerName},</p>
                <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
                <p>Order ID: <strong>#${orderId}</strong></p>
                <h3>Order Details:</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
                <p class="total">Total: ৳${orderDetails.total_amount.toLocaleString('bn-BD')}</p>
                <p>We'll notify you when your order is shipped.</p>
                <p>Thank you for choosing us!</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);
      logger.info(`Order confirmation email sent to ${customerEmail}`);

      return true;
    } catch (error) {
      logger.error('Failed to send order confirmation email:', error);
      return false;
    }
  }

  /**
   * Send generic notification email
   */
  static async sendNotification(
    recipientEmail: string,
    subject: string,
    message: string
  ): Promise<boolean> {
    try {
      // Check if email notifications are enabled
      if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'true') {
        logger.warn('Email notifications are disabled');
        return false;
      }

      // Validate required parameters
      if (!recipientEmail || recipientEmail.trim().length === 0) {
        throw new ApiError('Recipient email is required', 400);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipientEmail)) {
        throw new ApiError('Invalid email format', 400);
      }

      if (!subject || subject.trim().length === 0) {
        throw new ApiError('Email subject is required', 400);
      }

      if (!message || message.trim().length === 0) {
        throw new ApiError('Email message is required', 400);
      }

      const transporter = await this.getTransporter();

      const mailOptions = {
        from: `Zoddy <${process.env.GMAIL_FROM_EMAIL}>`,
        to: recipientEmail,
        subject,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #667eea; color: white; padding: 20px; text-align: center;">
                <h2>${subject}</h2>
              </div>
              <div style="background: #fff; padding: 30px; border: 1px solid #ddd;">
                ${message}
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);
      logger.info(`Notification email sent to ${recipientEmail}`);

      return true;
    } catch (error) {
      logger.error('Failed to send notification email:', error);
      return false;
    }
  }
}
