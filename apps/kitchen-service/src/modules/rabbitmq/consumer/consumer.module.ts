import { Module } from '@nestjs/common';
import { OrderProcessorService } from './order-processor.service';
import { OrderModule } from '../../order/order.module';

@Module({
  imports: [OrderModule],
  providers: [OrderProcessorService],
})
export class ConsumerModule {}
