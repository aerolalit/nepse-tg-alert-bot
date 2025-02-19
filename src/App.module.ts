import { CoreModule } from './core/Core.moduile';
import { AppConfigService } from './core/config/appConfig.service';
import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import cfg from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBotModule } from './modules/user-bot/UserBot.module';
import { TickerPriceModule } from './modules/stocks/TickerPrice.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceFetchCron } from './modules/cron/FetchPrice.cron';
import { TgBotModule } from './modules/tg-bot/TgBot.module';
import { AlertLogModule } from './modules/notification-log/AlertLog.module';
import { CronModule } from './modules/cron/Cron.module';
import { ChatMessageModule } from './modules/chat/ChatMessage.module';
import { UserModule } from './modules/users/User.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => cfg],
      envFilePath: [`.env`],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (appConfig: AppConfigService) => ({
        ...appConfig.dbConfig,
        entities: [__dirname + '/**/' + '*.entity.{ts,js}'],
        cache: false,
        autoLoadEntities: true,
      }),
      inject: [AppConfigService],
      imports: [CoreModule],
    }),
    ScheduleModule.forRoot(),
    UserBotModule,
    TickerPriceModule,
    CoreModule,
    TgBotModule,
    AlertLogModule,
    CronModule,
    ChatMessageModule,
    UserModule,
  ],
  providers: [PriceFetchCron],
})
export class AppModule {}
