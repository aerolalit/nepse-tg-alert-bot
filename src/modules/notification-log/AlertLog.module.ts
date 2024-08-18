import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertLog } from './AlertLog.entity';
import { AlertLogService } from './AlertLog.service';

@Module({
  imports: [TypeOrmModule.forFeature([AlertLog])],
  providers: [AlertLogService],
  exports: [AlertLogService],
})
export class AlertLogModule {}
