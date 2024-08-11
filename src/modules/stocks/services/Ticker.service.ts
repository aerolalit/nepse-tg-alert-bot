import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Ticker } from '../entities/Ticker.entity';

@Injectable()
export class TickerService {
  public constructor(
    @InjectRepository(Ticker)
    private readonly TickerRepository: Repository<Ticker>,
  ) {}

  public async findAll(): Promise<Ticker[]> {
    return this.TickerRepository.find();
  }

  public async count(): Promise<number> {
    return this.TickerRepository.count();
  }

  public async insert(ticker: string): Promise<Ticker> {
    const newTicker = this.TickerRepository.create({ ticker });
    return this.TickerRepository.save(newTicker);
  }

  public async delete(ticker: string): Promise<DeleteResult> {
    return this.TickerRepository.delete({ ticker });
  }
}
