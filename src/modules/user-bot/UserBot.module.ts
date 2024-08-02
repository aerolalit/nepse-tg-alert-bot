import { Module } from '@nestjs/common';
import { UserBotService } from './UserBot.service';

@Module({
  providers: [UserBotService],
  exports: [UserBotService],
})
export class UserBotModule {}
