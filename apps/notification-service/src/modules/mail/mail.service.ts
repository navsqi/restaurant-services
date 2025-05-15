import { Injectable, Logger } from '@nestjs/common';
import { Order } from 'libs/database/src/mysql/entities';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '../config/config.service';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const { host, port, user, pass, secure } = this.configService.mail;

    this.transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: false,
      auth: {
        user,
        pass,
      },
    });

    // Verify connection
    this.transporter
      .verify()
      .then(() => this.logger.log('SMTP connection established successfully'))
      .catch((err) =>
        this.logger.error(
          `Failed to establish SMTP connection: ${err.message}`,
        ),
      );
  }

  async sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: Mail.Attachment[];
  }): Promise<boolean> {
    try {
      const { to, subject, html, text, from, cc, bcc, attachments } = options;

      const mailOptions: nodemailer.SendMailOptions = {
        from: from || this.configService.mail.from,
        to,
        cc,
        bcc,
        subject,
        html,
        text: text || this.stripHtml(html), // Strip HTML tags for plain text version
        attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      return false;
    }
  }

  async sendOrderConfirmation(order: Order): Promise<boolean> {
    const { customerEmail, id: orderId, orderItems, totalAmount } = order;

    // Create an item list for the email
    const itemsHtml = orderItems
      .map(
        (item) => `
      <tr>
        <td>${item.menuItemName}</td>
        <td>${item.quantity}</td>
        <td>$${item.menuItemPrice}</td>
        <td>$${item.subtotal}</td>
      </tr>
    `,
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 2px solid #dee2e6;">
          <h1>Order Confirmation</h1>
          <p>Thank you for your order!</p>
        </div>
        
        <div style="padding: 20px;">
          <p>Hello,</p>
          <p>We're pleased to confirm that we've received your order (Order ID: <strong>${orderId}</strong>).</p>
          
          <div style="margin: 20px 0; border: 1px solid #dee2e6; border-radius: 4px;">
            <div style="background-color: #f8f9fa; padding: 10px 15px; font-weight: bold; border-bottom: 1px solid #dee2e6;">
              Order Summary
            </div>
            <div style="padding: 15px;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <th style="text-align: left; padding: 8px;">Item</th>
                    <th style="text-align: left; padding: 8px;">Qty</th>
                    <th style="text-align: left; padding: 8px;">Price</th>
                    <th style="text-align: left; padding: 8px;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr style="border-top: 1px solid #dee2e6;">
                    <td colspan="3" style="text-align: right; padding: 8px; font-weight: bold;">Total:</td>
                    <td style="padding: 8px;">$${totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <p>Thank you for choosing our service!</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: customerEmail,
      subject: `Order Confirmation - #${orderId}`,
      html,
    });
  }

  async sendOrderStatusUpdate(
    order: any,
    previousStatus: string,
  ): Promise<boolean> {
    const { customerEmail, id: orderId, status: currentStatus } = order;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 2px solid #dee2e6;">
          <h1>Order Status Update</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Hello,</p>
          <p>We're writing to inform you that the status of your order (Order ID: <strong>${orderId}</strong>) has been updated.</p>
          
          <div style="padding: 15px; margin: 20px 0; border: 1px solid #dee2e6; border-radius: 4px; background-color: #f8f9fa;">
            <div style="display: flex; align-items: center; justify-content: center; margin: 15px 0;">
              <span style="padding: 8px 15px; border-radius: 4px; font-weight: bold; background-color: #e9ecef; color: #495057;">
                ${previousStatus}
              </span>
              <span style="margin: 0 15px; font-size: 20px;">→</span>
              <span style="padding: 8px 15px; border-radius: 4px; font-weight: bold; background-color: #28a745; color: white;">
                ${currentStatus}
              </span>
            </div>
          </div>
          
          <p>If you have any questions about your order, please don't hesitate to contact our customer service team.</p>
          
          <p>Thank you for choosing our service!</p>
        </div>
        
        <div style="margin-top: 30px; font-size: 12px; color: #6c757d; text-align: center;">
          <p>This is an automated email, please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: customerEmail,
      subject: `Order #${orderId} Status Update: ${currentStatus}`,
      html,
    });
  }

  // Helper method to create a plain text version by stripping HTML
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
