// libs/data-models/src/lib/order-item.entity.ts
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MenuItem } from './menu-item.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.orderItems)
  @JoinColumn({ name: 'menu_item_id' })
  menuItem!: MenuItem;

  @Column()
  menuItemId!: string;

  @Column()
  orderId!: string;

  @Column({ length: 100 })
  menuItemName!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  menuItemPrice!: number;

  @Column({ default: 1 })
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;

  @Column({ nullable: true })
  specialInstructions!: string;
}
