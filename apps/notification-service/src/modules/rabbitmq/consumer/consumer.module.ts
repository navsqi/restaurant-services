import { Module } from '@nestjs/common';
import { OrderProcessorService } from './order-processor.service';
import { MailModule } from '../../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [OrderProcessorService],
})
export class ConsumerModule {}
