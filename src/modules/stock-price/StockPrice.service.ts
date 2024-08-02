import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockPrice } from './StockPrice.entity';
import { subMilliseconds } from 'date-fns';
import parseDuration from 'parse-duration';

@Injectable()
export class StockPriceService {
  constructor(
    @InjectRepository(StockPrice)
    private stockPriceRepository: Repository<StockPrice>,
  ) { }
  
  public async save(stockPriceData: Partial<StockPrice>[]): Promise<StockPrice[]> {
    const stockPrices = stockPriceData.map(data => this.stockPriceRepository.create(data));
    return this.stockPriceRepository.save(stockPrices);
  }

  public async getAllStockPrices(): Promise<StockPrice[]> {
    return this.stockPriceRepository.find();
  }

  public async getStockPrice(ticker: string, priceTime: Date): Promise<StockPrice | null> {
    return this.stockPriceRepository
      .createQueryBuilder('stockPrice')
      .where('stockPrice.ticker = :ticker', { ticker })
      .andWhere('stockPrice.priceTime <= :priceTime', { priceTime })
      .orderBy('stockPrice.priceTime', 'DESC')
      .getOne();
  }

  public async getStockPriceBefore(ticker: string, timeAmount: string): Promise<StockPrice | null> {
    const durationMs = parseDuration(timeAmount);
    if (durationMs === null || durationMs === undefined) {
      throw new Error('Invalid time amount format');
    }
    const priceTime = subMilliseconds(new Date(), durationMs);

    return this.getStockPrice(ticker, priceTime);
  }
}
