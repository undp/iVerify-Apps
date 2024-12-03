import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/JwtAuthGuard.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_ENV,
      signOptions: { expiresIn: '30m' }, // Token expiration time
    }),
  ],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
