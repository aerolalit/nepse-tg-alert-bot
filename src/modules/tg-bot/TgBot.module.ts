import { Module } from '@nestjs/common';
import { TgBotService } from './TgBot.service';
import { CoreModule } from 'src/core/Core.moduile';
import { TickerPriceModule } from '../stocks/TickerPrice.module';
import { TgBotController } from './TgBot.controller';

@Module({
  imports: [CoreModule, TickerPriceModule],
  providers: [TgBotService],
  exports: [TgBotService],
  controllers:[TgBotController]
})
export class TgBotModule {}
