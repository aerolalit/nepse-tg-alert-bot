import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TickerPrice } from '../entities/TickerPrice.entity';
import { subMilliseconds } from 'date-fns';
import parseDuration from 'parse-duration';

@Injectable()
export class TickerPriceService {
  public constructor(
    @InjectRepository(TickerPrice)
    private tickerPriceRepository: Repository<TickerPrice>,
  ) {}

  public async save(TickerPriceData: Partial<TickerPrice>[]): Promise<TickerPrice[]> {
    const TickerPrices = TickerPriceData.map((data) => this.tickerPriceRepository.create(data));
    return this.tickerPriceRepository.save(TickerPrices);
  }

  public async getAllTickerPrices(): Promise<TickerPrice[]> {
    return this.tickerPriceRepository.find();
  }

  public async getTickerPrice(ticker: string, priceTime: Date): Promise<TickerPrice | null> {
    return this.tickerPriceRepository
      .createQueryBuilder('TickerPrice')
      .where('TickerPrice.ticker = :ticker', { ticker })
      .andWhere('TickerPrice.priceTime <= :priceTime', { priceTime })
      .orderBy('TickerPrice.priceTime', 'DESC')
      .getOne();
  }

  public async getTickerPriceBefore(ticker: string, timeAmount: string): Promise<TickerPrice | null> {
    const durationMs = parseDuration(timeAmount);
    if (durationMs === null || durationMs === undefined) {
      throw new Error('Invalid time amount format');
    }
    const priceTime = subMilliseconds(new Date(), durationMs);

    return this.getTickerPrice(ticker, priceTime);
  }
}
