import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedMenuItems1747224447852 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO menu_items (id, name, price, description, isAvailable) VALUES
            ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Classic Burger', 12.99, 'Juicy beef patty with lettuce, tomato, and our special sauce', 1),
            ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Veggie Wrap', 9.99, 'Fresh vegetables wrapped in a whole wheat tortilla with hummus', 1),
            ('d290f1ee-6c54-4b01-90e6-d701748f0853', 'Caesar Salad', 8.99, 'Crisp romaine lettuce with Caesar dressing, croutons, and parmesan', 1),
            ('d290f1ee-6c54-4b01-90e6-d701748f0854', 'Chicken Alfredo Pasta', 15.99, 'Fettuccine pasta in a creamy alfredo sauce with grilled chicken', 1),
            ('d290f1ee-6c54-4b01-90e6-d701748f0855', 'Margherita Pizza', 13.99, 'Traditional pizza with tomato sauce, fresh mozzarella, and basil', 1),
            ('d290f1ee-6c54-4b01-90e6-d701748f0856', 'Fish and Chips', 14.99, 'Battered cod with a side of crispy fries and tartar sauce', 1),
            ('d290f1ee-6c54-4b01-90e6-d701748f0857', 'Chocolate Brownie', 6.99, 'Rich chocolate brownie served with vanilla ice cream', 1),
            ('d290f1ee-6c54-4b01-90e6-d701748f0858', 'Iced Coffee', 3.99, 'Cold brewed coffee served over ice', 1),
            ('d290f1ee-6c54-4b01-90e6-d701748f0859', 'Fresh Lemonade', 2.99, 'Freshly squeezed lemonade with a hint of mint', 1),
            ('d290f1ee-6c54-4b01-90e6-d701748f085a', 'Seasonal Special', 17.99, 'Ask your server about our seasonal special', 1);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM menu_items WHERE name IN (
            'Classic Burger', 'Veggie Wrap', 'Caesar Salad', 'Chicken Alfredo Pasta', 
            'Margherita Pizza', 'Fish and Chips', 'Chocolate Brownie', 'Iced Coffee', 
            'Fresh Lemonade', 'Seasonal Special'
        )`);
  }
}
