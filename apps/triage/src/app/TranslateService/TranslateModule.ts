import { Module } from '@nestjs/common';
import { TranslateService } from './TranslateService';

@Module({
  providers: [TranslateService],
  exports: [TranslateService],
})
export class TranslateModule {}
