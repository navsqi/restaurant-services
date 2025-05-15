import { Controller, Post, Body, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  async sendTestEmail(@Body() body: { email: string }) {
    const result = await this.mailService.sendEmail({
      to: 'nauvalholic@gmail.com',
      subject: 'Test Email from NestJS App',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email sent from your NestJS application.</p>
        <p>If you're seeing this, your email configuration is working correctly!</p>
        <p>Time sent: ${new Date().toLocaleString()}</p>
      `,
    });

    return {
      success: result,
      message: result
        ? `Test email sent successfully`
        : 'Failed to send test email',
    };
  }
}
