import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { AlertLog } from './AlertLog.entity';

@Injectable()
export class AlertLogService {
  public constructor(
    @InjectRepository(AlertLog)
    private readonly alertLogRepo: Repository<AlertLog>,
  ) {}

  public async create(AlertLog: Partial<AlertLog>): Promise<AlertLog> {
    const newAlertLog = this.alertLogRepo.create(AlertLog);
    return this.alertLogRepo.save(newAlertLog);
  }

  public async wasNotificationSentWithinInterval(ticker: string, intervalInMinutes: number): Promise<boolean> {
    const intervalDate = new Date(Date.now() - intervalInMinutes * 60 * 1000);
    const count = await this.alertLogRepo.count({
      where: {
        ticker,
        sentAt: MoreThan(intervalDate),
      },
    });
    return count > 0;
  }

  public async getLatestNotification(ticker: string): Promise<AlertLog | null> {
    return this.alertLogRepo.findOne({
      where: {
        ticker,
      },
      order: {
        sentAt: 'DESC',
      },
    });
  }

  public async save(AlertLog: AlertLog): Promise<AlertLog> {
    return this.alertLogRepo.save(AlertLog);
  }
}
