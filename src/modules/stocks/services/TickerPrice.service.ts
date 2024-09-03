import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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

  public async getAllTickers(): Promise<string[]> {
    return this.tickerPriceRepository
      .createQueryBuilder('TickerPrice')
      .select('DISTINCT ticker')
      .getRawMany()
      .then((tickers) => tickers.map(({ ticker }) => ticker));
  }

  public async getPriceDataCountForDate(date: Date): Promise<number> {
    const start = new Date(date.setHours(6, 0, 0, 0));
    const end = new Date(date.setHours(18, 0, 0, 0));
    return this.tickerPriceRepository.count({ where: { priceTime: Between(start, end) } });
  }

  public async getOpeningPriceForDate(ticker: string, date: Date): Promise<TickerPrice | null> {
    const start = new Date(date.setHours(6, 0, 0, 0));
    const end = new Date(date.setHours(18, 0, 0, 0));
    return this.tickerPriceRepository.findOne({
      where: { ticker, priceTime: Between(start, end) },
      order: { priceTime: 'ASC' },
    });
  }

  public async getClosingPriceForDate(ticker: string, date: Date): Promise<TickerPrice | null> {
    const start = new Date(date.setHours(6, 0, 0, 0));
    const end = new Date(date.setHours(18, 0, 0, 0));
    return this.tickerPriceRepository.findOne({
      where: { ticker, priceTime: Between(start, end) },
      order: { priceTime: 'DESC' },
    });
  }
  // get all pricess between two dates for ticker
  public async getPrices(ticker: string, startDate: Date, endDate: Date): Promise<TickerPrice[]> {
    return this.tickerPriceRepository.find({
      where: {
        ticker,
        priceTime: Between(startDate, endDate),
      },
    });
  }

  public async getLatestTickerPrice(ticker: string): Promise<TickerPrice> {
    return this.tickerPriceRepository.findOneOrFail({ where: { ticker }, order: { priceTime: 'DESC' } });
  }

  public async getTickerPrice(ticker: string, priceTime: Date): Promise<TickerPrice | null> {
    return this.tickerPriceRepository
      .createQueryBuilder('TickerPrice')
      .where('TickerPrice.ticker = :ticker', { ticker })
      .andWhere('TickerPrice.priceTime <= :priceTime', { priceTime })
      .orderBy('TickerPrice.priceTime', 'DESC')
      .getOne();
  }
  public async getTickerPriceOrFail(ticker: string, priceTime: Date): Promise<TickerPrice> {
    return this.tickerPriceRepository
      .createQueryBuilder('TickerPrice')
      .where('TickerPrice.ticker = :ticker', { ticker })
      .andWhere('TickerPrice.priceTime <= :priceTime', { priceTime })
      .orderBy('TickerPrice.priceTime', 'DESC')
      .getOneOrFail();
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
