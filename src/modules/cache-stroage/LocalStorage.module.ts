import { Module } from '@nestjs/common';
import { LocalStorageService } from './LocalStorage.service';

@Module({
  providers: [LocalStorageService],
  exports: [LocalStorageService],
})
export class LocalStorageModule {}
