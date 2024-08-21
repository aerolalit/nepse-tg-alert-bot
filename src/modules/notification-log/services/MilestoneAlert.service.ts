import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MilestoneAlert } from '../entities/MilestoneAlert.entity';

@Injectable()
export class MilestoneAlertService {
  constructor(
    @InjectRepository(MilestoneAlert)
    private readonly repo: Repository<MilestoneAlert>,
  ) {}

  public async findAll(): Promise<MilestoneAlert[]> {
    return this.repo.find();
  }
  public async findLatestByTicker(ticker: string): Promise<MilestoneAlert | null> {
    return this.repo.findOne({ where: { ticker }, order: { createdAt: 'DESC' } });
  }

  public async findLatestByTickerOrFail(ticker: string): Promise<MilestoneAlert> {
    return this.repo.findOneOrFail({ where: { ticker }, order: { createdAt: 'DESC' } });
  }

  public async save(data: MilestoneAlert): Promise<MilestoneAlert> {
    return this.repo.save(data);
  }

  public async saveMany(data: MilestoneAlert[]): Promise<MilestoneAlert[]> {
    return this.repo.save(data);
  }

  public async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
