import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { v4 as uuidv4 } from 'uuid';

export class LocationClients {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    id?: string = uuidv4();

    @IsString()
    @IsOptional()
    key?: string = uuidv4();

    constructor(name?: string) {
        this.name = name;
    }
}
