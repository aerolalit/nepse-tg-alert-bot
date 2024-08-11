import { Module } from '@nestjs/common';
import { TgBotService } from './TgBot.service';
import { CoreModule } from 'src/core/Core.moduile';
import { TickerPriceModule } from '../stocks/TickerPrice.module';

@Module({
  imports: [CoreModule, TickerPriceModule],
  providers: [TgBotService],
  exports: [TgBotService],
})
export class TgBotModule {}
