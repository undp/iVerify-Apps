import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './createRole.dto';

export class EditRoleDto extends PartialType(CreateRoleDto) { }