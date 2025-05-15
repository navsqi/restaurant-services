// src/rabbitmq/rabbitmq.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from '../config/config.service';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: amqp.ChannelModel;
  private channel: amqp.Channel;
  private logger: Logger;

  constructor(private configService: ConfigService) {
    this.logger = new Logger(this.constructor.name);
  }

  async onModuleInit() {
    await this.initialize();
  }

  async initialize() {
    try {
      // Create connection
      const rabbitMqUrl =
        this.configService.rabbitmq.url || 'amqp://localhost:5672';
      this.connection = await amqp.connect(rabbitMqUrl);
      this.channel = await this.connection.createChannel();

      // Create exchange
      const { orders } = this.configService.rabbitmq.exchanges;
      await this.channel.assertExchange(orders.name, orders.type, {
        durable: true,
      });

      // Create queues and bind to exchange
      const { orderProcess, orderConfirmation } =
        this.configService.rabbitmq.queues;

      await this.channel.assertQueue(orderProcess.name, orderProcess.options);
      await this.channel.bindQueue(orderProcess.name, orders.name, '');

      await this.channel.assertQueue(
        orderConfirmation.name,
        orderConfirmation.options,
      );
      await this.channel.bindQueue(orderConfirmation.name, orders.name, '');

      this.logger.log('RabbitMQ connection established successfully');
    } catch (error) {
      this.logger.error('Failed to initialize RabbitMQ connection', error);
      // Implement retry logic or throw error based on your needs
      setTimeout(() => this.initialize(), 5000);
    }
  }

  async publishToExchange(exchange: string, routingKey: string, message: any) {
    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      return this.channel.publish(exchange, routingKey, messageBuffer);
    } catch (error) {
      this.logger.error('Error publishing message to exchange', error);
      throw error;
    }
  }

  async publishToOrdersExchange(message: any) {
    return this.publishToExchange(
      this.configService.rabbitmq.exchanges.orders.name,
      '',
      message,
    );
  }

  async consumeFromQueue(queue: string, callback: (message: any) => void) {
    return this.channel.consume(
      queue,
      (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          callback(content);
          this.channel.ack(message);
        }
      },
      { noAck: false },
    );
  }

  async closeConnection() {
    try {
      await this.channel.close();
      await this.connection.close();
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection', error);
    }
  }
}
