import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  limit: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  offset: number;
}