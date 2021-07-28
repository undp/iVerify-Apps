import { Controller, UseGuards, HttpStatus, Response, Post, Body, UseFilters, BadRequestException, NotFoundException, BadGatewayException, Inject, forwardRef } from '@nestjs/common';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthService } from './auth.service';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { InfoLogger } from '../logger/info-logger.service';
import { TokenGenerationDto } from './dto/TokenGeneration.dto';
import { RefreshTokenAuthGuard } from '../guards/RefreshToken-auth.guard';
import { LocalStrategy } from './passport/LocalStrategy';
import { LocalAuthGuard } from '../guards/Local-auth.guard';
import { userMessages } from '../../constant/messages';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    userService: any;
    constructor(private readonly authService: AuthService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService, 
        private InfoLogger: InfoLogger) {
        this.InfoLogger.setContext('AuthController');
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    public async login(@Body() login: LoginUserDto) {
        const userData = await this.usersService.findByEmail(login.email);
        if (!userData) {
            this.InfoLogger.error(userMessages.userNotFound);
            throw new NotFoundException(userMessages.userNotFound);
        } else {
            const token = await this.authService.createToken(userData);
            if (!token) throw new BadGatewayException();
            this.InfoLogger.log('Token Generated');
            return {token, userData};
        }
    }

    
    @Post('generateToken')
    @ApiBearerAuth()
    @UseGuards(RefreshTokenAuthGuard)
    public async generateToken(@Body() userData: TokenGenerationDto) {
        return await this.usersService.findOne(userData.email).then(user => {
            if (!user) {
                this.InfoLogger.error(userMessages.userNotFound);
                throw new BadRequestException(userMessages.userNotFound);
            } else {
                const token = this.authService.createToken(user);
                if (!token) throw new BadGatewayException();
                this.InfoLogger.log('Token Generated');
                return token;
            }
        });
    }
}