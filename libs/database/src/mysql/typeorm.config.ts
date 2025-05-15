import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as Entities from './entities';

dotenv.config();

// DB migration config
export default new DataSource({
  type: 'mysql',
  host: process.env['DB_HOST'],
  port: parseInt(process.env['DB_PORT'] || '5432', 10),
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_NAME'],
  entities: Entities,
  migrations: ['libs/database/src/mysql/migrations/**/*.ts'],
  synchronize: false,
});