import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderItem } from './order-item.entity';

@Entity('menu_items')
export class MenuItem extends BaseEntity {
  @Column({ length: 100 })
  name!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: true })
  isAvailable!: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.menuItem)
  orderItems!: OrderItem[];
}
