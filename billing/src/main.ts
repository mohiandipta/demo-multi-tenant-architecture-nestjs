import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan'
import * as compression from 'compression'
import { setupSecurity } from './security/secutiry';
import { json } from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(process.env.API_GLOBAL_PREFIX)
  app.use(json({limit: '15mb'}))
  app.use(morgan('combined'));
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.enableCors()
  app.use(compression({
    threshold: 512 // set the threshold to 512 bytes
  }))

  app.useGlobalPipes(new ValidationPipe)

  const options = new DocumentBuilder()
    .setTitle('cms API Docs')
    .setDescription('cms API description')
    .setVersion('1.0')
    .addServer('/')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger/docs', app, document);

  // security
  // setupSecurity(app)

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
