import { Module } from '@nestjs/common';
import { environment } from '../environments/environment';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { DatabaseService } from './services/database.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MongooseModule.forRoot(environment.MongoDBConnection), AuthModule, UsersModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, DatabaseService],
})
export class AppModule {}
