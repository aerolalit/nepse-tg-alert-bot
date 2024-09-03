import { Controller, Post, Body } from '@nestjs/common';
import { TgBotService } from './TgBot.service';
import { SendMessageDto } from './dtos/SendMessage.dto';
import { TickerSubscriptionService } from '../stocks/services/TickerSubscription.service';
import { ApiTags } from '@nestjs/swagger';
import { BroadCastMessageDto } from './dtos/BroadCastMessage.dto';

@ApiTags('Telegram Bot')
@Controller('tg-bot')
export class TgBotController {
  constructor(
    private readonly tgBotService: TgBotService,
    private readonly subscriptionService: TickerSubscriptionService,
  ) {}

  @Post('broadcast-message')
  public async broadcast(@Body() sendMessageDto: BroadCastMessageDto): Promise<any> {
    const { message } = sendMessageDto;
    for (const chatId of await this.subscriptionService.getChatIds()) {
      await this.tgBotService.sendMessage(chatId, message);
    }
    return { success: true };
  }

  @Post('send-message')
  public async sendMessage(@Body() sendMessageDto: SendMessageDto): Promise<any> {
    const { chatId, message } = sendMessageDto;
    await this.tgBotService.sendMessage(chatId, message);
    return { success: true };
  }
}
