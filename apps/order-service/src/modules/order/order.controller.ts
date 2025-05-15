import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Place an order' })
  @ApiResponse({
    status: 201,
    description: 'Order has been successfully created',
  })
  placeOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get('menu')
  @ApiOperation({ summary: 'Fetch food menu' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the list of available menu items with names and prices',
  })
  getMenu() {
    return this.orderService.getMenu();
  }

  @Get('status/:id')
  @ApiOperation({ summary: 'Track the status of an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current status of the order',
  })
  getOrderStatus(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
}
