import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TickerSubscriptionService } from '../stocks/services/TickerSubscription.service';
import { TickerPriceService } from '../stocks/services/TickerPrice.service';
import { TgBotService } from '../tg-bot/TgBot.service';

@Injectable()
export class DailyReportCron {
  private readonly logger = new Logger(DailyReportCron.name);

  constructor(
    private readonly tickerSubscriptionService: TickerSubscriptionService,
    private readonly tickerPriceService: TickerPriceService,
    private readonly botService: TgBotService,
  ) {}

  @Cron('20 11 * * 0-4') // Runs at 11:20 AM on Sunday, Monday, Tuesday, Wednesday, and Thursday
  public async handleCron() {
    this.logger.debug('Running Daily Report Cron Job');
    const count = await this.tickerPriceService.getPriceDataCountForDate(this.currentDate);
    if (count < 100) {
      this.logger.log(`Not enough data for today. Skipping the daily report. ${count}`);
      return;
    }

    const chatIds = await this.tickerSubscriptionService.getAllUniqueChatIds();

    for (const chatId of chatIds) {
      const subscriptions = await this.tickerSubscriptionService.listSubscriptionsByChatId(chatId);
      subscriptions.sort((a, b) => a.ticker.localeCompare(b.ticker));

      const tableData: string[][] = [['Ticker', 'Open', 'Close', '%Change']];

      await Promise.all(
        subscriptions.map(async (subscription) => {
          const openPrice = await this.tickerPriceService.getOpeningPriceForDate(subscription.ticker, this.currentDate);
          const closePrice = await this.tickerPriceService.getClosingPriceForDate(
            subscription.ticker,
            this.currentDate,
          );
          if (openPrice && closePrice) {
            tableData.push([
              subscription.ticker,
              Number(openPrice.ltp).toFixed(0),
              Number(closePrice.ltp).toFixed(0),
              this.calculatePercentageChange(openPrice.ltp, closePrice.ltp).toFixed(1) + '%',
            ]);
          }
        }),
      );
      const message = `Daily Report for ${this.currentDate.toDateString()}`;
      if (tableData.length > 1) await this.botService.sendTableMessage(chatId, message, tableData);
    }
  }

  private calculatePercentageChange(oldPrice: number, newPrice: number): number {
    return ((newPrice - oldPrice) / oldPrice) * 100;
  }

  private get currentDate() {
    return new Date();
  }
}
