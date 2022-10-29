import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsObject()
    params: Record<string, unknown>;
}
