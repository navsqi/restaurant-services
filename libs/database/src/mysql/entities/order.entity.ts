import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ length: 100 })
  customerEmail!: string;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Processing', 'Ready', 'Delivered', 'Cancelled'],
    default: 'Pending',
  })
  status!: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount!: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  orderItems!: OrderItem[];

  @Column({ nullable: true })
  notes!: string;

  @Column({ nullable: true })
  trackingId!: string;
}
