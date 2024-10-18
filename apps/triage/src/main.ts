/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as fs from 'fs';

async function bootstrap() {
  const is_ssl = process.env.IS_SSL === 'true';
  let app;
  if (is_ssl) {
    const httpsOptions = {
      key: fs.readFileSync('private.key'),
      cert: fs.readFileSync('certificate.crt'),
    };
    app = await NestFactory.create(AppModule, {
      httpsOptions,
    });
  } else {
    app = await NestFactory.create(AppModule);
  }
  app.enableCors();
  const globalPrefix = 'triage';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3335;
  const config = new DocumentBuilder()
    .setTitle('Triage')
    .setDescription('The Triage API description')
    .setVersion('1.0')
    .addTag('Triage')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
