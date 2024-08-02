import { Module } from '@nestjs/common';
import { AppConfigService } from './config/appConfig.service';

@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class CoreModule {}
