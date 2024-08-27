import { Controller, Post, Body } from '@nestjs/common';
import { TgBotService } from './TgBot.service';
import { SendMessageDto } from './dtos/SendMessage.dto';
import { TickerSubscriptionService } from '../stocks/services/TickerSubscription.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Telegram Bot')
@Controller('tg-bot')
export class TgBotController {
  constructor(private readonly tgBotService: TgBotService, private readonly subscriptionService:TickerSubscriptionService) {}

  @Post('broadcast-message')
  public async sendMessage(@Body() sendMessageDto: SendMessageDto): Promise<any> {
    const { message } = sendMessageDto;
    for (const chatId of await this.subscriptionService.getChatIds()) {
      await this.tgBotService.sendMessage(chatId, message);
    }
    return {success: true};
  }
}

