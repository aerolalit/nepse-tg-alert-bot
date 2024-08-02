import { DataSource } from 'typeorm';
import cfg from './config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...cfg.dbConfig,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/[1234567890]*.js'],
  synchronize: false,
});
