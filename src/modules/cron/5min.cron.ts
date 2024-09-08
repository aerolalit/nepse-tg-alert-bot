import { Injectable } from '@nestjs/common';
import { BasePriceAlertService } from './BasePriceAlert.service';
import { Cron } from '@nestjs/schedule';
import { TgBotService } from '../tg-bot/TgBot.service';
import { TickerSubscriptionService } from '../stocks/services/TickerSubscription.service';
import { TickerPriceService } from '../stocks/services/TickerPrice.service';
import moment from 'moment-timezone';
import { AlertLogService } from '../notification-log/AlertLog.service';

@Injectable()
export class QuaterlyPriceAlertService extends BasePriceAlertService {
  protected isEnabled: boolean = false;
  protected readonly priceChangeThreshold = 3; // Percentage

  protected readonly interval = 5 * 60 * 1000; // 1 hour in milliseconds
  protected readonly cooldownTime = 2 * 60 * 1000; // 10 minutes in milliseconds

  protected readonly prevPriceLookupWindowInMinutes = 1;

  public constructor(
    protected readonly tickerPriceService: TickerPriceService,
    protected readonly tickerSubscriptionService: TickerSubscriptionService,
    protected readonly alertLogService: AlertLogService,
    protected readonly botService: TgBotService,
  ) {
    super(tickerPriceService, tickerSubscriptionService, alertLogService, botService);
  }

  @Cron('* 8-11 * * 0-4') // Sunday to Thursday, 7am to 12pm every 1 minute
  public async handleCron() {
    await super.handleCron();
  }
}
