import { NestFactory } from '@nestjs/core';
import { AppModule } from './App.module';
import { AllExceptionsFilter } from './modules/cron/AllException.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api/v1');


  const config = new DocumentBuilder()
    .setTitle('NepseWatcher API documentation')
    .setDescription('API documentation for the NepseWatcher telegram bot.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Set the global prefix for all APIs

  // Setup Swagger without the global prefix
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3001);
  
  Logger.log(`Server running on http://localhost:3001/api/v1`, 'Bootstrap');
  Logger.log(`Swagger documentation available at http://localhost:3001/api-docs`, 'Bootstrap');
}
bootstrap();
