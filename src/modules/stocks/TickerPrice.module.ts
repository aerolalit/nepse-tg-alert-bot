import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TickerPrice } from './entities/TickerPrice.entity';
import { TickerPriceService } from './services/TtockPrice.service';
import { Ticker } from './entities/Ticker.entity';
import { TickerService } from './services/Ticker.service';
import { TickerSubscription } from './entities/TickerSubscription.entity';
import { TickerSubscriptionService } from './services/TickerSubscription.service';
import { TickerController } from './controllers/Ticker.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TickerPrice, Ticker, TickerSubscription])],
  providers: [TickerPriceService, TickerService, TickerSubscriptionService],
  controllers: [TickerController],
  exports: [TickerPriceService, TickerService, TickerSubscriptionService],
})
export class TickerPriceModule {}
