import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { v4 as uuidv4 } from 'uuid';

export class LocationClients {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    key?: string;

    constructor(params?: Partial<LocationClients>) {
        this.name = params.name;
        this.id = params?.id ?? uuidv4();
        this.key = params?.key ?? uuidv4();
    }
}
