import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  private getRequired(key: string): string {
    return this.configService.getOrThrow(key);
  }

  private get(key: string): string {
    return this.configService.get<string>(key) || '';
  }

  get app() {
    return {
      port: Number(this.getRequired('PORT')),
      name: this.getRequired('NAME'),
    };
  }

  get swagger() {
    return {
      url: 'docs',
      name: this.getRequired('NAME'),
      description: 'API Documentation: ' + this.getRequired('NAME'),
      version: '1.0',
    };
  }
  get db() {
    return {
      username: this.getRequired('DB_USERNAME'),
      password: this.getRequired('DB_PASSWORD'),
      host: this.getRequired('DB_HOST'),
      port: Number(this.getRequired('DB_PORT')),
      dbName: this.getRequired('DB_NAME'),
    };
  }

  get jwt() {
    return {
      secret: this.getRequired('JWT_SECRET'),
    };
  }

  get rabbitmq() {
    return {
      url: this.getRequired('RABBITMQ_URL'),
      exchanges: {
        orders: {
          name: 'orders',
          type: 'fanout',
        },
      },
      queues: {
        orderProcess: {
          name: 'order.process',
          options: {
            durable: true,
          },
        },
        orderConfirmation: {
          name: 'order.confirmation',
          options: {
            durable: true,
          },
        },
      },
    };
  }
}
