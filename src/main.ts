import { NestFactory } from '@nestjs/core';
import { AppModule } from './App.module';
import { AllExceptionsFilter } from './modules/cron/AllException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3001); // Start the server on port 30001
}
bootstrap();
