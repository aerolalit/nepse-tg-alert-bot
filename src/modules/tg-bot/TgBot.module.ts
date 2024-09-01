import { Module } from '@nestjs/common';
import { TgBotService } from './TgBot.service';
import { CoreModule } from 'src/core/Core.moduile';
import { TickerPriceModule } from '../stocks/TickerPrice.module';
import { TgBotController } from './TgBot.controller';
import { ChatMessageModule } from '../chat/ChatMessage.module';
import { UserModule } from '../users/User.module';

@Module({
  imports: [CoreModule, TickerPriceModule, ChatMessageModule, UserModule],
  providers: [TgBotService],
  exports: [TgBotService],
  controllers: [TgBotController],
})
export class TgBotModule {}
