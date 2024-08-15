import { Injectable } from '@nestjs/common';
import { BasePriceAlertService } from './BasePriceAlert.service';
import { Cron } from '@nestjs/schedule';
import { TgBotService } from '../tg-bot/TgBot.service';
import { NotificationLogService } from '../notification-log/NotificationLog.service';
import { TickerSubscriptionService } from '../stocks/services/TickerSubscription.service';
import { TickerPriceService } from '../stocks/services/TtockPrice.service';
import moment from 'moment-timezone';

@Injectable()
export class QuaterlyPriceAlertService extends BasePriceAlertService {
  protected isEnabled: boolean = false;
  protected readonly priceChangeThreshold = 2; // Percentage

  protected readonly interval = 5 * 60 * 1000; // 1 hour in milliseconds
  protected readonly cooldownTime = 2 * 60 * 1000; // 10 minutes in milliseconds

  protected readonly prevPriceLookupWindowInMinutes = 1;

  public constructor(
    protected readonly tickerPriceService: TickerPriceService,
    protected readonly tickerSubscriptionService: TickerSubscriptionService,
    protected readonly notificationLogService: NotificationLogService,
    protected readonly botService: TgBotService,
  ) {
    super(tickerPriceService, tickerSubscriptionService, notificationLogService, botService);
  }

  @Cron('*/1 * * * *') // Every 2 minutes
  public async handleCron() {
    await super.handleCron();
  }

  protected getFormatedMsg(ticker: string, ltp: number, percentageChange: number, priceTime: Date): string {
    const formattedTime = moment(priceTime).tz('Asia/Kathmandu').format('MM-DD HH:mm:ss');
    return `Price Alert: ${ticker} price has changed by ${percentageChange.toFixed(2)}% to ${ltp.toFixed(
      2,
    )} at ${formattedTime}`;
  }
}
