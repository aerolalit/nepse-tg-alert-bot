import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { NotificationLog } from './NotificationLog.entity';

@Injectable()
export class NotificationLogService {
  public constructor(
    @InjectRepository(NotificationLog)
    private readonly notificationLogRepository: Repository<NotificationLog>,
  ) {}

  public async create(notificationLog: Partial<NotificationLog>): Promise<NotificationLog> {
    const newNotificationLog = this.notificationLogRepository.create(notificationLog);
    return this.notificationLogRepository.save(newNotificationLog);
  }

  public async wasNotificationSentWithinInterval(ticker: string, intervalInMinutes: number): Promise<boolean> {
    const intervalDate = new Date(Date.now() - intervalInMinutes * 60 * 1000);
    const count = await this.notificationLogRepository.count({
      where: {
        ticker,
        sentAt: MoreThan(intervalDate),
      },
    });
    return count > 0;
  }

  public async getLatestNotification(ticker: string): Promise<NotificationLog | null> {
    return this.notificationLogRepository.findOne({
      where: {
        ticker,
      },
      order: {
        sentAt: 'DESC',
      },
    });
  }

  public async save(notificationLog: NotificationLog): Promise<NotificationLog> {
    return this.notificationLogRepository.save(notificationLog);
  }
}
