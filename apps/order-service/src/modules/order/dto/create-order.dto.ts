// apps/order-service/src/app/order/dto/create-order.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({
    description: 'ID of the menu item',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0852',
  })
  @IsNotEmpty()
  @IsString()
  menuItemId: string;

  @ApiProperty({
    description: 'Quantity of the menu item',
    example: 2,
    minimum: 1,
  })
  @IsNotEmpty()
  quantity: number;

  @ApiPropertyOptional({
    description: 'Any special instructions for this item',
    example: 'No onions please',
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer email address',
    example: 'customer@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @ApiProperty({
    description: 'List of menu items in the order',
    type: [OrderItemDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @ApiPropertyOptional({
    description: 'Additional notes for the order',
    example: 'Please deliver to the back door',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
