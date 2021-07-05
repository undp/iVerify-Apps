import { Module } from '@nestjs/common';
import { environment } from '../environments/environment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { User } from './users/user.model';
import { Roles } from './roles/roles.model';
import { StatsModule } from './stats/stats.module';
import { StatsService } from './stats/stats.service';
import { Stats } from './stats/models/stats.model';
import { StatsFormatService } from './stats/stats-format.service';
import { MeedanCheckClientModule } from '@iverify/meedan-check-client';
import { StatsController } from './stats/stats-controller';

@Module({
  imports: [
    UsersModule, 
    AuthModule, 
    RolesModule,
    StatsModule,
    MeedanCheckClientModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'test',
      password: 'test',
      database: 'db',
      autoLoadEntities: true,
      synchronize: true
    }),
    TypeOrmModule.forFeature([User, Roles, Stats]),

  ],
  controllers: [AppController, UsersController, StatsController],
  providers: [AppService, UsersService, StatsService, StatsFormatService],
})
export class AppModule {}
