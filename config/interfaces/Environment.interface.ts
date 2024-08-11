import { DbConfigInterface } from './db-config.interface';
import { UserBotConfigInterface } from './UserBotConfig.interface';
import { TgBotConfigInterface } from './TgBotConfig.interface';

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
  tgBotConfig: TgBotConfigInterface;
}
