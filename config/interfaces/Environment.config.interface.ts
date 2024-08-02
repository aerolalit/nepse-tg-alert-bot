import { DbConfigInterface } from './db-config.interface';
import { AzureBlobConfigInterface } from './AzureBlobConfig.interface';
import { UserBotConfigInterface } from './UserBotConfig.interface';

export enum EnvironmentNameEnum {
  LOCAL = 'local',
  DEV = 'dev',
  UAT = 'uat',
  PROD = 'prod',
}

export interface EnvironmentInterface {
  env: EnvironmentNameEnum;
  serverPort: number;
  dbConfig: DbConfigInterface;
  userBotConfig: UserBotConfigInterface;
  azureBlobConfig?: AzureBlobConfigInterface;
}
