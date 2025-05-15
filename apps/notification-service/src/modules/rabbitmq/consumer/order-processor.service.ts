import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OrderEventService } from '../order-event.service';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class OrderProcessorService implements OnModuleInit {
  private readonly logger = new Logger(OrderProcessorService.name);

  constructor(
    private readonly orderEventsService: OrderEventService,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit() {
    await this.setupConsumers();
  }

  private async setupConsumers() {
    // Setup consumer for order.confirmation queue
    await this.orderEventsService.setupOrderConfirmationConsumer(
      async (message) => {
        this.logger.log(
          `Sending confirmation for order: ${JSON.stringify(message)}`,
        );

        try {
          const order = message.data;
          await this.sendOrderConfirmation(order);
        } catch (error) {
          this.logger.error(
            `Error sending confirmation: ${error.message}`,
            error.stack,
          );
        }
      },
    );
  }

  private async sendOrderConfirmation(order: any): Promise<void> {
    // Example: Send email confirmation
    this.logger.log(
      `Sending order confirmation email to ${order.customerEmail}`,
    );

    this.mailService.sendOrderConfirmation(order);
  }
}
