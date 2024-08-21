import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertLog } from './entities/AlertLog.entity';
import { AlertLogService } from './AlertLog.service';
import { MilestoneAlert } from './entities/MilestoneAlert.entity';
import { MilestoneAlertService } from './services/MilestoneAlert.service';

@Module({
  imports: [TypeOrmModule.forFeature([AlertLog, MilestoneAlert])],
  providers: [AlertLogService, MilestoneAlertService],
  exports: [AlertLogService, MilestoneAlertService],
})
export class AlertLogModule {}
