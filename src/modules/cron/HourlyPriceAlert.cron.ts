import { Injectable } from '@nestjs/common';
import { BasePriceAlertService } from './BasePriceAlert.service';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationLog } from '../notification-log/NotificationLog.entity';
import { Repository } from 'typeorm';
import { TickerSubscription } from '../stocks/entities/TickerSubscription.entity';
import { TickerPrice } from '../stocks/entities/TickerPrice.entity';
import { TgBotService } from '../tg-bot/TgBot.service';

@Injectable()
export class HourlyPriceAlertService extends BasePriceAlertService {
  protected isEnabled: boolean = false;
  protected readonly priceChangeThreshold = 5; // Percentage

  protected readonly interval = 60 * 60 * 1000; // 1 hour in milliseconds
  protected readonly cooldownTime = 10 * 60 * 1000; // 10 minutes in milliseconds

  protected readonly prevPriceLookupWindowInMinutes = 5;

  public constructor(
    @InjectRepository(TickerPrice)
    protected readonly tickerPriceRepository: Repository<TickerPrice>,
    @InjectRepository(TickerSubscription)
    protected readonly tickerSubscriptionRepository: Repository<TickerSubscription>,
    @InjectRepository(NotificationLog)
    protected readonly notificationLogRepository: Repository<NotificationLog>,
    protected readonly botService: TgBotService,
  ) {
    super(tickerPriceRepository, tickerSubscriptionRepository, notificationLogRepository, botService);
  }

  @Cron('*/5 * * * *') // Every 5 minutes
  public async handleCron() {
    await super.handleCron();
  }
}
