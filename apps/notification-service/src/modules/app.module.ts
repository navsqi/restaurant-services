import { Entities } from '@nest-monorepo/database';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { ConsumerModule } from './rabbitmq/consumer/consumer.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.db.host,
          port: config.db.port,
          username: config.db.username,
          password: config.db.password,
          database: config.db.dbName,
          entities: Entities,
          logging: ['query', 'error'],
        };
      },
    }),
    RabbitMQModule,
    ConsumerModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
