import { Between, Repository } from 'typeorm';
import { TickerPrice } from '../stocks/entities/TickerPrice.entity';
import { Injectable } from '@nestjs/common';
import { TickerSubscription } from '../stocks/entities/TickerSubscription.entity';
import { NotificationLog } from '../notification-log/NotificationLog.entity';
import { TgBotService } from '../tg-bot/TgBot.service';

@Injectable()
export abstract class BasePriceAlertService {
  protected abstract isEnabled: boolean;
  protected abstract readonly priceChangeThreshold: number;
  protected abstract readonly interval: number; // in milliseconds
  protected abstract readonly cooldownTime: number; // in milliseconds

  protected abstract readonly prevPriceLookupWindowInMinutes: number;
  private readonly currentPriceLookupWindowInMinutes = 2;

  public constructor(
    protected readonly tickerPriceRepository: Repository<TickerPrice>,
    protected readonly tickerSubscriptionRepository: Repository<TickerSubscription>,
    protected readonly notificationLogRepository: Repository<NotificationLog>,
    protected readonly botService: TgBotService,
  ) {}

  public async handleCron() {
    if (!this.isEnabled) {
      return;
    }
    const tickers = await this.tickerPriceRepository
      .createQueryBuilder('tickerPrice')
      .select('DISTINCT ticker')
      .getRawMany();

    for (const { ticker } of tickers) {
      const currentPrice = await this.getCurrentPrice(ticker);
      const previousPrice = await this.getPreviousPrice(ticker);

      if (currentPrice && previousPrice) {
        const percentageChange = ((currentPrice.ltp - previousPrice.ltp) / previousPrice.ltp) * 100;

        if (Math.abs(percentageChange) > this.priceChangeThreshold) {
          await this.notifySubscribers(ticker, currentPrice.ltp, percentageChange);
        }
      }
    }
  }

  protected async getPreviousPrice(ticker: string): Promise<TickerPrice | null> {
    return this.getPrice(ticker, false);
  }

  private async getCurrentPrice(ticker: string): Promise<TickerPrice | null> {
    return this.getPrice(ticker, true);
  }

  protected async getPrice(ticker: string, isCurrent: boolean): Promise<TickerPrice | null> {
    const currentTime = new Date();
    const lookupWindowInMinutes = isCurrent
      ? this.currentPriceLookupWindowInMinutes
      : this.prevPriceLookupWindowInMinutes;
    const timeOffset = isCurrent ? 0 : this.interval;
    const referenceTime = new Date(currentTime.getTime() - timeOffset);
    const startTime = new Date(referenceTime.getTime() - lookupWindowInMinutes * 60 * 1000);
    const endTime = isCurrent ? currentTime : new Date(referenceTime.getTime() + lookupWindowInMinutes * 60 * 1000);

    const prices = await this.tickerPriceRepository.find({
      where: {
        ticker,
        priceTime: Between(startTime, endTime),
      },
    });

    if (!prices.length) {
      // No price found, handle accordingly
      return null;
    }

    // Find the price closest to the referenceTime
    const closestPrice = prices.reduce((closest, current) => {
      const closestDiff = Math.abs(closest.priceTime.getTime() - referenceTime.getTime());
      const currentDiff = Math.abs(current.priceTime.getTime() - referenceTime.getTime());
      return currentDiff < closestDiff ? current : closest;
    });

    return closestPrice;
  }

  private async notifySubscribers(ticker: string, ltp: number, percentageChange: number) {
    const lastNotification = await this.notificationLogRepository.findOne({
      where: { ticker },
      order: { sentAt: 'DESC' },
    });

    const now = new Date();
    if (!lastNotification || now.getTime() - new Date(lastNotification.sentAt).getTime() > this.cooldownTime) {
      const subscriptions = await this.tickerSubscriptionRepository.find({ where: { ticker } });

      for (const subscription of subscriptions) {
        await this.botService.sendPriceAlert(
          subscription.chatId,
          ticker,
          ltp,
          percentageChange,
          this.interval / 1000 / 60,
        );
        console.log(
          `Sending notification to ${subscription.chatId}: ${ticker} price increased by ${percentageChange.toFixed(
            2,
          )}%`,
        );
      }

      // Log the notification
      const notificationLog = new NotificationLog();
      notificationLog.ticker = ticker;
      notificationLog.sentAt = now;
      await this.notificationLogRepository.save(notificationLog);
    }
  }
}
