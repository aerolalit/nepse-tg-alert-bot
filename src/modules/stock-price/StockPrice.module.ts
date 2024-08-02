import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockPrice } from './StockPrice.entity';
import { StockPriceService } from './StockPrice.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockPrice])],
  providers: [StockPriceService],
  exports: [StockPriceService],
})
export class StockPriceModule {}
