import { EnvironmentInterface, EnvironmentNameEnum } from './interfaces/Environment.interface';

const config: EnvironmentInterface = {
  env: EnvironmentNameEnum.LOCAL,
  serverPort: 3000,
  dbConfig: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: 5432,
    username: process.env.POSTGRES_USER || 'tg_user',
    password: process.env.POSTGRES_PASS || 'asdfSDF123!',
    database: process.env.POSTGRES_DBNAME || 'tg_dev',
    logging: false,
    ssl: false,
  },
  userBotConfig: {
    phoneNumber: process.env.USER_BOT_PHONE_NUMBER || '+491722125663',
    appId: process.env.USER_BOT_APP_ID || '25663791',
    apiHash: process.env.USER_BOT_API_HASH || '8fad946a58ad5adc64fc7b6939ac6b78',
  },
  tgBotConfig: {
    token: process.env.TELEGRAM_BOT_TOKEN || '',
  }
}
export default config;
