import { EnvironmentInterface, EnvironmentNameEnum } from './interfaces/Environment.interface';

const config: EnvironmentInterface = {
  env: EnvironmentNameEnum.LOCAL,
  serverPort: 3000,
  dbConfig: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: 5432,
    username: process.env.POSTGRES_USER || '',
    password: process.env.POSTGRES_PASS || '',
    database: process.env.POSTGRES_DBNAME || '',
    logging: false,
    ssl: false,
  },
  userBotConfig: {
    phoneNumber: process.env.USER_BOT_PHONE_NUMBER || '',
    appId: process.env.USER_BOT_APP_ID || '',
    apiHash: process.env.USER_BOT_API_HASH || '',
  },
  tgBotConfig: {
    token: process.env.TELEGRAM_BOT_TOKEN || '',
  }
}
export default config;
