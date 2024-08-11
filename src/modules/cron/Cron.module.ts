import { Module } from '@nestjs/common';
import { HourlyPriceAlertService } from './HourlyPriceAlert.cron';
import { QuaterlyPriceAlertService } from './QuaterlyPriceAlert.cron';
import { TgBotModule } from '../tg-bot/TgBot.module';

@Module({
  imports: [TgBotModule],
  providers: [HourlyPriceAlertService, QuaterlyPriceAlertService],
})
export class CronModule {}
