import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Order } from 'libs/database/src/mysql/entities';
import { OrderService } from '../../order/order.service';
import { OrderEventService } from '../order-event.service';

@Injectable()
export class OrderProcessorService implements OnModuleInit {
  private readonly logger = new Logger(OrderProcessorService.name);

  constructor(
    private readonly orderEventsService: OrderEventService,
    private readonly orderService: OrderService,
  ) {}

  async onModuleInit() {
    await this.setupConsumers();
  }

  private async setupConsumers() {
    // Setup consumer for order.process queue
    await this.orderEventsService.setupOrderProcessConsumer(async (message) => {
      this.logger.log(`Processing order: ${JSON.stringify(message)}`);

      try {
        const order = message.data;
        await this.updateStatusOrder(order);
      } catch (error) {
        this.logger.error(
          `Error sending confirmation: ${error.message}`,
          error.stack,
        );
      }
    });
  }

  private async updateStatusOrder(order: Order): Promise<void> {
    this.logger.log(`Update status order: ${order.id}`);

    this.orderService.updateStatusOrder(order.id, 'Processing');
  }
}
