import { Module } from '@nestjs/common';
import { HourlyPriceAlertService } from './HourlyPriceAlert.cron';
import { QuaterlyPriceAlertService } from './QuaterlyPriceAlert.cron';
import { TgBotModule } from '../tg-bot/TgBot.module';
import { TestPriceAlertCron } from './Test.cron';
import { TickerPriceModule } from '../stocks/TickerPrice.module';
import { AlertLogModule } from '../notification-log/AlertLog.module';

@Module({
  imports: [TgBotModule, TickerPriceModule, AlertLogModule],
  providers: [HourlyPriceAlertService, QuaterlyPriceAlertService, TestPriceAlertCron],
})
export class CronModule {}
