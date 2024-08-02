import { EnvironmentInterface, EnvironmentNameEnum } from './interfaces/Environment.config.interface';

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
  azureBlobConfig: {
    blobConnectionString:
      process.env.AZURE_BLOB_CONNECTION_STRING ||
      'DefaultEndpointsProtocol=https;AccountName=saindwwdevkjr;AccountKey=UbiJ6NterLc/ImVkvL6Bsx0Zx9dEz6o0XtsSpxDg89J17ikztGP96bCfkMGyzNe1AS/u1hLtKUzY+AStgKun3g==;EndpointSuffix=core.windows.net',
  },
};
export default config;
