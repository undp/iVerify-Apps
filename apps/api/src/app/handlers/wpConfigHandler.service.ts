import { Injectable } from '@nestjs/common';
import { LocationsService } from '../locations/locations.service';

export interface WpCredentialConfigs {
    production: boolean;
    tokenExpTime: number;
    refreshExpTime: number;
    JWTsecret: string;
    JWTSecretRefreshToken: string;
    ClientID: string;
    ClientSecret: string;
    redirect_uri: string;
    WordpressUrl: string;
    WPPassword: string;
}

@Injectable()
export class WpConfigHandler {
    constructor(private locationsService: LocationsService) {}

    public async getConfigByLocation(
        locationId: string
    ): Promise<WpCredentialConfigs> {
        const { params } = await this.locationsService.findById(locationId);

        const getParam: any = (param) =>
            params.find(({ key }) => key === param);

        const authParams: WpCredentialConfigs = {
            production: Boolean(getParam('PRODUCTION')?.value ?? false),
            tokenExpTime: Number(getParam('TOKEN_EXP_TIME')?.value ?? 1200),
            refreshExpTime: Number(getParam('REFRESH_EXP_TIME')?.value ?? 2400),
            JWTsecret: getParam('JTW_SECRET')?.value,
            JWTSecretRefreshToken: getParam('JWT_SECRET_TOKEN')?.value,
            ClientID: getParam('CLIENT_ID')?.value,
            ClientSecret: getParam('CLIENT_SECRET')?.value,
            redirect_uri: getParam('REDIRECT_URI')?.value,
            WordpressUrl: getParam('WP_URL')?.value,
            WPPassword: getParam('WP_PASSWORD')?.value,
        };

        return authParams;
    }
}
