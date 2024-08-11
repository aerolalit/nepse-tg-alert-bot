import { EnvironmentNameEnum } from '../../../config/interfaces/Environment.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DbConfigInterface } from '../../../config/interfaces/db-config.interface';
import { TgBotConfigInterface } from 'config/interfaces/TgBotConfig.interface';

@Injectable()
export class AppConfigService {
  public constructor(private readonly configService: ConfigService) {}

  public get env(): EnvironmentNameEnum {
    return this.configService.getOrThrow('env');
  }

  public get isProduction(): boolean {
    return this.env === EnvironmentNameEnum.PROD || this.env === EnvironmentNameEnum.UAT;
  }

  public get isNonProduction(): boolean {
    return !this.isProduction;
  }

  public get serverPort(): number {
    return parseInt(this.configService.getOrThrow('serverPort') || '3000', 10);
  }

  public get dbConfig(): DbConfigInterface {
    return this.configService.getOrThrow('dbConfig');
  }

  public get telegramBotConfig(): TgBotConfigInterface {
    return this.configService.getOrThrow('tgBotConfig');
  }
}
