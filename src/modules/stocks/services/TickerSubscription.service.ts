import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TickerSubscription } from '../entities/TickerSubscription.entity';

@Injectable()
export class TickerSubscriptionService {
  public constructor(
    @InjectRepository(TickerSubscription)
    private readonly tickerSubscriptionRepository: Repository<TickerSubscription>,
  ) {}

  public async createSubscription(chatId: string, ticker: string): Promise<TickerSubscription> {
    const subscription = this.tickerSubscriptionRepository.create({ ticker, chatId });
    return this.tickerSubscriptionRepository.save(subscription);
  }

  public async deleteSubscription(chatId: string, ticker: string): Promise<void> {
    await this.tickerSubscriptionRepository.delete({ ticker, chatId });
    await this.listSubscriptionsByChatId(chatId);
  }

  public async listSubscriptionsByChatId(chatId: string): Promise<TickerSubscription[]> {
    return this.tickerSubscriptionRepository.find({ where: { chatId } });
  }

  public async deleteAllSubscriptionsByChatId(chatId: string): Promise<void> {
    await this.tickerSubscriptionRepository.delete({ chatId });
  }
}
