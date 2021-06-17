import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';
import { CreateRoleDto } from './createRole.dto';

export class EditRoleDto extends PartialType(CreateRoleDto) {}