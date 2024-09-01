import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { Ticker } from '../entities/Ticker.entity';
import { CreateTickerDto } from '../dtos/CreateTicker..dto';

@Injectable()
export class TickerService {
  public constructor(
    @InjectRepository(Ticker)
    private readonly repo: Repository<Ticker>,
  ) {}

  public async findAll(): Promise<Ticker[]> {
    return this.repo.find({ order: { ticker: 'ASC' } });
  }

  public async count(): Promise<number> {
    return this.repo.count();
  }

  public async insert(dto: CreateTickerDto): Promise<InsertResult> {
    const newTicker = this.repo.create(dto);
    return this.repo.insert(newTicker);
  }

  public async delete(ticker: string): Promise<DeleteResult> {
    return this.repo.delete({ ticker });
  }
}
