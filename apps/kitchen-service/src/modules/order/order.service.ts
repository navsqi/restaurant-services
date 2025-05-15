import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'libs/database/src/mysql/entities';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  public async updateStatusOrder(orderId: string, status: string) {
    return this.orderRepo.update(
      {
        id: orderId,
      },
      {
        status,
      },
    );
  }
}
