import { EnvironmentInterface, EnvironmentNameEnum } from './interfaces/Environment.interface';

const config: EnvironmentInterface = {
  env: EnvironmentNameEnum.DEV,
  serverPort: 3000,
  dbConfig: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'pdb-ind-ww-dev-kjr.postgres.database.azure.com',
    port: 5432,
    username: process.env.POSTGRES_USER || 'krijar_dev',
    password: process.env.POSTGRES_PASS || 'krijar_dev',
    database: process.env.POSTGRES_DBNAME || 'krijar_dev',
    logging: false,
    ssl: true,
  },
  userBotConfig: {
    phoneNumber: process.env.USER_BOT_PHONE_NUMBER || '+491722125663',
    appId: process.env.USER_BOT_APP_ID || '25663791',
    apiHash: process.env.USER_BOT_API_HASH || '8fad946a58ad5adc64fc7b6939ac6b78',
  },
  tgBotConfig: {
    token: process.env.TELEGRAM_BOT_TOKEN || '',
  }

};
export default config;
