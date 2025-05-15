import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem, Order, OrderItem } from 'libs/database/src/mysql/entities';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { generateRandomString, IResponse } from '@nest-monorepo/common';
import { OrderEventService } from '../rabbitmq/order-event.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepo: Repository<MenuItem>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    private orderEventService: OrderEventService,
  ) {}

  async getMenu(): Promise<
    IResponse<{
      menu: MenuItem[];
    }>
  > {
    const menu = await this.menuItemRepo.find();

    return {
      data: {
        menu,
      },
    };
  }

  async create(
    createOrderDto: CreateOrderDto,
  ): Promise<IResponse<{ order: Order }>> {
    const { orderItems: items, customerEmail, notes } = createOrderDto;

    console.log('generateRandomString(10)', generateRandomString(10));
    // Create and save the order first
    const order = this.orderRepo.create({
      status: 'Pending',
      orderItems: [],
      customerEmail,
      notes,
      trackingId: generateRandomString(10),
    });

    // Save to get an ID
    const savedOrder = await this.orderRepo.save(order);

    let totalAmount = 0;

    // Now create order items with the order ID
    for (const itemDto of items) {
      const menuItem = await this.menuItemRepo.findOneByOrFail({
        id: itemDto.menuItemId,
      });

      const subtotal = menuItem.price * itemDto.quantity;
      totalAmount += subtotal;

      const orderItem = this.orderItemRepo.create({
        menuItem,
        menuItemId: itemDto.menuItemId,
        orderId: savedOrder.id, // Set the orderId
        quantity: itemDto.quantity,
        menuItemName: menuItem.name,
        menuItemPrice: menuItem.price,
        subtotal,
        specialInstructions: itemDto.specialInstructions,
      });

      savedOrder.orderItems.push(orderItem);
    }

    savedOrder.totalAmount = totalAmount;

    // Save again with the items
    const result = await this.orderRepo.save(savedOrder);

    await this.orderEventService.publishOrderCreated(result);

    return {
      data: {
        order: result,
      },
    };
  }

  async findOne(id: string): Promise<IResponse<{ order: Order }>> {
    const order = await this.orderRepo.findOneByOrFail({ id });
    return {
      data: {
        order,
      },
    };
  }

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
