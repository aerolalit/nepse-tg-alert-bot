import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TickerSubscription } from '../entities/TickerSubscription.entity';

@Injectable()
export class TickerSubscriptionService {
  private readonly logger = new Logger(TickerSubscriptionService.name);

  public constructor(
    @InjectRepository(TickerSubscription)
    private readonly tickerSubscriptionRepository: Repository<TickerSubscription>,
  ) {}

  public async createSubscription(chatId: string, ticker: string): Promise<TickerSubscription> {
    let subscription = this.tickerSubscriptionRepository.create({ ticker, chatId });
    subscription = await this.tickerSubscriptionRepository.save(subscription);
    this.logger.log(`Created subscription for ${chatId} to ${ticker}`);
    return subscription;
  }

  public async getSubscriptionsByTicker(ticker: string): Promise<TickerSubscription[]> {
    return this.tickerSubscriptionRepository.find({ where: { ticker } });
  }

  public async deleteSubscription(chatId: string, ticker: string): Promise<void> {
    await this.tickerSubscriptionRepository.delete({ ticker, chatId });
    await this.listSubscriptionsByChatId(chatId);
    this.logger.log(`Deleted subscription for ${chatId} to ${ticker}`);
  }

  public async getAllUniqueChatIds(): Promise<string[]> {
    const subscriptions = await this.tickerSubscriptionRepository
      .createQueryBuilder('subscription')
      .select('DISTINCT subscription."chatId"')
      .getRawMany();
    return subscriptions.map((sub) => sub.chatId);
  }

  public async listSubscriptionsByChatId(chatId: string): Promise<TickerSubscription[]> {
    return this.tickerSubscriptionRepository.find({ where: { chatId } });
  }

  public async getChatIds(): Promise<string[]> {
    return this.tickerSubscriptionRepository
      .createQueryBuilder()
      .select('"chatId"')
      .distinct(true)
      .getRawMany()
      .then((result) => result.map((r) => r.chatId));
  }

  public async deleteAllSubscriptionsByChatId(chatId: string): Promise<void> {
    await this.tickerSubscriptionRepository.delete({ chatId });
  }
}
