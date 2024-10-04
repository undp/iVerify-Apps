/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('private.pem '),
    cert: fs.readFileSync('certificate.pem'),
  };
  const app = await NestFactory.create(AppModule ,{
    httpsOptions,
  });
  app.enableCors();
  const globalPrefix = 'publisher';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3334;
  const config = new DocumentBuilder()
    .setTitle('Swagger')
    .setDescription('The Publisher API description')
    .setVersion('1.0')
    .addTag('Swagger')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const hostname = "0.0.0.0";
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
