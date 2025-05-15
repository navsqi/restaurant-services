import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem, Order, OrderItem } from 'libs/database/src/mysql/entities';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, MenuItem, OrderItem])],
  controllers: [],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
