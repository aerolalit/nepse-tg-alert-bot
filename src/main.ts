import { NestFactory } from '@nestjs/core';
import { AppModule } from './App.module';
import * as dotenv from 'dotenv';
import { UserBotService } from './modules/user-bot/UserBot.service';
import { StockPriceService } from './modules/stock-price/StockPrice.service';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const botService = app.get(UserBotService);
  const stocksName = 'ADBL AHL AKPL AKJCL ALBSL CIT CITY HIDCL KBSH PROFL';
  const tickersArray = ['ADBL', 'AHL', 'AKPL', 'AKJCL', 'ALBSL', 'CIT', 'CITY', 'HIDCL', 'KBSH', 'PROFL'];
  const a: typeof tickersArray[number] = 'ADs'
  await botService.sendMessage(process.env.PRICE_BOT_USERNAME as string, stocksName);

  const result = await botService.extractStockData();
  const stockPriceService = app.get(StockPriceService);
  await stockPriceService.save(result);
  await app.listen(30001); // Start the server on port 30001
}
bootstrap();
