import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserBotService } from '../user-bot/UserBot.service';
import { TickerService } from '../stocks/services/Ticker.service';
import { Ticker } from '../stocks/entities/Ticker.entity';
import { TickerPriceService } from '../stocks/services/TtockPrice.service';

@Injectable()
export class PriceFetchCron {
  private readonly logger = new Logger(PriceFetchCron.name);
  public constructor(
    private readonly botService: UserBotService,
    private readonly tickerService: TickerService,
    private readonly tickerPriceService: TickerPriceService,
  ) {}

  @Cron('*/2 7-12 * * 0-4')
  public async sendPriceRequestCron(): Promise<void> {
    this.logger.log('Price request cron job started');
    await this.sendPriceRequest();
    await this.sleep(10 * 1000);
    await this.fetchAndSaveStockData();

    this.logger.log('Price request cron job finished');
  }

  private async fetchAndSaveStockData(): Promise<void> {
    this.logger.log('Fetching and saving stock data');
    const tickerCount = await this.tickerService.count();

    const result = await this.botService.fetchAndExtractStockData(tickerCount);
    await this.tickerPriceService.save(result);
  }

  private async sendPriceRequest(): Promise<void> {
    const tickers: Ticker[] = await this.tickerService.findAll();
    const tickerNames: string[] = tickers.map((ticker: Ticker) => ticker.ticker);

    for (let i = 0; i < tickerNames.length; i += 10) {
      const message: string = tickerNames.slice(i, i + 10).join(' ');
      await this.botService.sendMessage(process.env.PRICE_BOT_USERNAME as string, message);
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
