import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserBotService } from './UserBot.service';

@Injectable()
export class BotSchedulerService {
  constructor(private readonly botService: UserBotService) {}

  @Cron('* * * * *')
  async handleCron() {
    const stocksName = 'ADBL AHL AKPL AKJCL ALBSL CIT CITY HIDCL KBSH PROFL';
    await this.botService.sendMessage(process.env.PRICE_BOT_USERNAME as string, stocksName);
  }
}