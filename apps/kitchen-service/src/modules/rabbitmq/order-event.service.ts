import { Injectable } from '@nestjs/common';
import { Order } from 'libs/database/src/mysql/entities';
import { ConfigService } from '../config/config.service';
import { RabbitMQService } from './rabbitmq.service';

@Injectable()
export class OrderEventService {
  constructor(
    private readonly rabbitmqService: RabbitMQService,
    private configService: ConfigService,
  ) {}

  async publishOrderCreated(order: Order) {
    await this.rabbitmqService.publishToOrdersExchange({
      event: 'order.created',
      data: order,
      timestamp: new Date().toISOString(),
    });
  }

  async publishOrderStatusChanged(order: Order, previousStatus: string) {
    await this.rabbitmqService.publishToOrdersExchange({
      event: 'order.status_changed',
      data: {
        orderId: order.id,
        previousStatus,
        currentStatus: order.status,
        order,
      },
      timestamp: new Date().toISOString(),
    });
  }

  async setupOrderProcessConsumer(callback: (data: any) => Promise<void>) {
    await this.rabbitmqService.consumeFromQueue(
      this.configService.rabbitmq.queues.orderProcess.name,
      callback,
    );
  }

  async setupOrderConfirmationConsumer(callback: (data: any) => Promise<void>) {
    await this.rabbitmqService.consumeFromQueue(
      this.configService.rabbitmq.queues.orderConfirmation.name,
      callback,
    );
  }
}
