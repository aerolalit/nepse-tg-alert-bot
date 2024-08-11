import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationLog } from './NotificationLog.entity';
import { NotificationLogService } from './NotificationLog.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationLog])],
  providers: [NotificationLogService],
  exports: [NotificationLogService],
})
export class NotificationLogModule {}
