import { Module } from '@nestjs/common';
import { CommonModule } from '@angular/common';
import { S3Service } from './s3.service';
@Module({
 providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
