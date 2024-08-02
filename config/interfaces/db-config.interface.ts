export interface DbConfigInterface {
  host: string;
  port: number;
  type: 'postgres';
  username: string;
  password: string;
  database: string;
  logging: boolean;
  ssl: boolean;
  [key: string]: any;
}
