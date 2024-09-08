import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MilestoneAlert } from 'src/modules/notification-log/entities/MilestoneAlert.entity';
import { MilestoneAlertService } from 'src/modules/notification-log/services/MilestoneAlert.service';
import { TickerPriceService } from 'src/modules/stocks/services/TickerPrice.service';
import { TickerSubscriptionService } from 'src/modules/stocks/services/TickerSubscription.service';
import { TgBotService } from 'src/modules/tg-bot/TgBot.service';

@Injectable()
export class MilestoneCron {
  private readonly logger: Logger = new Logger(MilestoneCron.name);
  constructor(
    private readonly milestoneAlertService: MilestoneAlertService,
    private readonly tickerPriceService: TickerPriceService,
    private readonly subscriptionService: TickerSubscriptionService,
    private readonly botService: TgBotService,
  ) {}

  @Cron('* 7-11 * * 0-4') // Sunday to Thursday, 7am to 12pm every 1 minute
  public async handleCron() {
    const tickers = await this.tickerPriceService.getAllTickers();

    const milestoneAlerts = await this.getFirstMilestoneToAdd(tickers);
    await this.milestoneAlertService.saveMany(milestoneAlerts);

    for (const ticker of tickers) {
      const lastMilestoneAlert = await this.milestoneAlertService.findLatestByTickerOrFail(ticker);
      const tickerPrice = await this.tickerPriceService.getLatestTickerPrice(ticker);

      const diff = Math.abs(tickerPrice.createdAt.getTime() - lastMilestoneAlert.createdAt.getTime());
      const COOLDOWN_TIME_MS = 30 * 60 * 1000; // 7 minutes

      const isUnderCooldown = diff < COOLDOWN_TIME_MS;

      tickerPrice.ltp = Number(tickerPrice.ltp);
      const currentPrice = tickerPrice.ltp;
      const nearestMilestones = this.getNearestMilestones(currentPrice);
      const milestoneAlert: MilestoneAlert = new MilestoneAlert({ ticker });

      if (lastMilestoneAlert.direction === 'UP') {
        if (nearestMilestones.lower > lastMilestoneAlert.milestone && currentPrice > nearestMilestones.lower) {
          milestoneAlert.milestone = nearestMilestones.lower;
          milestoneAlert.direction = 'UP';
        } else if (currentPrice < lastMilestoneAlert.milestone) {
          if (!isUnderCooldown) {
            milestoneAlert.milestone = nearestMilestones.upper;
            milestoneAlert.direction = 'DOWN';
          } else {
            this.logger.log(`${ticker} Milestone DOWN ${nearestMilestones.upper} - COOLDOWN`);
          }
        }
      } else {
        if (nearestMilestones.upper < lastMilestoneAlert.milestone && currentPrice < nearestMilestones.upper) {
          milestoneAlert.milestone = nearestMilestones.upper;
          milestoneAlert.direction = 'DOWN';
        } else if (currentPrice > lastMilestoneAlert.milestone) {
          if (!isUnderCooldown) {
            milestoneAlert.milestone = nearestMilestones.lower;
            milestoneAlert.direction = 'UP';
          } else {
            this.logger.log(`${ticker} Milestone UP ${nearestMilestones.lower} - COOLDOWN`);
          }
        }
      }

      if (milestoneAlert.milestone) {
        await this.milestoneAlertService.save(milestoneAlert);
        await this.notifySubscribers(milestoneAlert, currentPrice);
        this.logger.log(
          `${ticker} Milestone ${milestoneAlert.direction} ${milestoneAlert.milestone} - ${currentPrice}`,
        );
      }
    }
  }

  public async getFirstMilestoneToAdd(tickers: string[]): Promise<MilestoneAlert[]> {
    const milestones: Array<MilestoneAlert | undefined> = await Promise.all(
      tickers.map(async (ticker) => {
        const lastMilestoneAlert = await this.milestoneAlertService.findLatestByTicker(ticker);
        if (!lastMilestoneAlert) {
          const tickerPrice = await this.tickerPriceService.getLatestTickerPrice(ticker);
          const nearestMilestones = this.getNearestMilestones(tickerPrice.ltp);
          return new MilestoneAlert({
            ticker,
            milestone: nearestMilestones.lower,
            direction: 'UP',
          });
        }
      }),
    );

    return milestones.filter((x) => !!x) as MilestoneAlert[];
  }

  public getNearestMilestones(price: number): { lower: number; upper: number } {
    let step: number;
    if (price < 100) {
      step = 5;
    } else if (price < 200) {
      step = 10;
    } else if (price < 500) {
      step = 25;
    } else if (price < 1000) {
      step = 50;
    } else if (price < 2000) {
      step = 100;
    } else if (price < 5000) {
      step = 250;
    } else if (price < 10000) {
      step = 500;
    } else {
      step = 1000;
    }

    return { lower: Math.floor(price / step) * step, upper: Math.ceil(price / step) * step };
  }

  private async notifySubscribers(milestone: MilestoneAlert, currentPrice: number) {
    const subscribers = await this.subscriptionService.getSubscriptionsByTicker(milestone.ticker);
    const message =
      (milestone.direction === 'UP' ? '🟢' : '🔴') +
      `${milestone.ticker} ${milestone.direction === 'UP' ? 'rises above' : 'falls through'} ${
        milestone.milestone
      } (ltp: ${currentPrice})`;
    for (const subscriber of subscribers) {
      this.botService.sendMessage(subscriber.chatId, message);
    }
  }
}
