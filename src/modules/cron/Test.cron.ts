import { Injectable } from '@nestjs/common';
import { BasePriceAlertService } from './BasePriceAlert.service';
import { TgBotService } from '../tg-bot/TgBot.service';
import { NotificationLogService } from '../notification-log/NotificationLog.service';
import { TickerPriceService } from '../stocks/services/TtockPrice.service';
import { TickerSubscriptionService } from '../stocks/services/TickerSubscription.service';
import * as moment from 'moment-timezone';

@Injectable()
export class TestPriceAlertCron extends BasePriceAlertService {
  protected isEnabled: boolean = true;
  protected readonly priceChangeThreshold = 4; // Percentage

  protected readonly interval = 60 * 60 * 1000; // 1 hour in milliseconds
  protected readonly cooldownTime = 30 * 60 * 1000; // 10 minutes in milliseconds

  protected readonly prevPriceLookupWindowInMinutes = 5;

  public constructor(
    protected readonly tickerPriceService: TickerPriceService,
    protected readonly tickerSubscriptionService: TickerSubscriptionService,
    protected readonly notificationLogService: NotificationLogService,
    protected readonly botService: TgBotService,
  ) {
    super(tickerPriceService, tickerSubscriptionService, notificationLogService, botService);
    console.log('TestPriceAlertCron constructor');
    this.handleCron();
  }

  private minute = 60;

  public async handleCron() {
    for (let i = 0; i < 300; i++) {
      console.log(`Minute: ${this.minute}`);
      await super.handleCron();
      this.minute += 1;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  protected get currentDate(): Date {
    return new Date(new Date('2024-08-14 07:02:12.847615+02').getTime() + this.minute * 60 * 1000);
  }

  protected getFormatedMsg(ticker: string, ltp: number, percentageChange: number, priceTime: Date): string {
    const icon = percentageChange > 0 ? '🟢' : '🔴';
    const symbol = percentageChange > 0 ? '+' : '';
    const interval = this.interval < 60 ? `${this.interval / 60 / 1000}m` : `${this.interval / 60 / 1000}h`;
    const formattedTime = moment(priceTime).tz('Asia/Kathmandu').format('MM-DD HH:mm:ss');
    return (
      icon +
      ` ${ticker} - ltp: ${ltp} (${symbol}${percentageChange.toFixed(2)}% in last ${interval}) at ${formattedTime}`
    );
  }
}
