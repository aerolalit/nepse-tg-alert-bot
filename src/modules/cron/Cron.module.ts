import { Module } from '@nestjs/common';
import { HourlyPriceAlertService } from './HourlyPriceAlert.cron';
import { QuaterlyPriceAlertService } from './QuaterlyPriceAlert.cron';
import { TgBotModule } from '../tg-bot/TgBot.module';
import { TestPriceAlertCron } from './Test.cron';
import { TickerPriceModule } from '../stocks/TickerPrice.module';
import { NotificationLogModule } from '../notification-log/Nofication.module';

@Module({
  imports: [TgBotModule, TickerPriceModule, NotificationLogModule],
  providers: [HourlyPriceAlertService, QuaterlyPriceAlertService, TestPriceAlertCron],
})
export class CronModule {}
