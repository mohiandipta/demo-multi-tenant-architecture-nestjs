import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan'
import * as compression from 'compression'
import { json } from 'body-parser'
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({limit: '5mb'}))
  app.use(morgan('combined'));
  app.enableCors()
  app.use(compression({
    threshold: 512 // set the threshold to 512 bytes
  }))

  app.useGlobalPipes(new ValidationPipe)

  await app.listen(process.env.SERVER_PORT || 5050);
}
bootstrap();
