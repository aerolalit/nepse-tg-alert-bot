import { Injectable, Logger } from '@nestjs/common';
import { BasePriceAlertService } from './BasePriceAlert.service';
import { Cron } from '@nestjs/schedule';
import { TgBotService } from '../tg-bot/TgBot.service';
import { AlertLogService } from '../notification-log/AlertLog.service';
import { TickerSubscriptionService } from '../stocks/services/TickerSubscription.service';
import { TickerPriceService } from '../stocks/services/TtockPrice.service';

@Injectable()
export class HourlyPriceAlertService extends BasePriceAlertService {
  private readonly logger = new Logger(HourlyPriceAlertService.name);
  protected isEnabled: boolean = true;
  protected readonly priceChangeThreshold = 4; // Percentage

  protected readonly interval = 60 * 60 * 1000; // 1 hour in milliseconds
  protected readonly cooldownTime = 10 * 60 * 1000; // 10 minutes in milliseconds

  protected readonly prevPriceLookupWindowInMinutes = 5;

  public constructor(
    protected readonly tickerPriceService: TickerPriceService,
    protected readonly tickerSubscriptionService: TickerSubscriptionService,
    protected readonly alertLogService: AlertLogService,
    protected readonly botService: TgBotService,
  ) {
    super(tickerPriceService, tickerSubscriptionService, alertLogService, botService);
  }

  @Cron('*/5 7-12 * * 0-4') // Sunday to Thursday, 7am to 12pm every 5 minutes
  public async handleCron() {
    this.logger.log('Running HourlyPriceAlertService');
    await super.handleCron();
  }
}
