import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';
import * as fs from 'fs';
import { AccessControlMiddleware } from './middleware/access-control/accessControl.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import configService from './database/ormconfig.service';
import { StorageModule } from './utils/azure/storage.module';
import { GateWayModule } from './socket.io/gateway.module';
import { TenantMiddleware } from './middleware/tenant/tenant.middleware';
import { REQUEST } from '@nestjs/core';
import { SubscriptionModule } from './modules/subscription/subscription.module';

const logsFolderPath = 'logs';

// Ensure the logs folder exists, create it if not
if (!fs.existsSync(logsFolderPath)) {
  fs.mkdirSync(logsFolderPath);
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (request: Request) => {
        const tenant = request['tenant'];
        return configService.getTypeOrmConfig(tenant);
      },
      inject: [REQUEST],
    }),
    // TypeOrmModule.forRoot(configService.getTypeOrmConfig("afv")),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        redact: {
          paths: [
            'req.headers',
            'req.body',
            'res.headers',
            'req.remoteAddress',
            'req.remotePort',
          ],
          remove: true,
        },
        transport: {
          target: 'pino/file',
          options: {
            // Specify the log file path
            destination: `${logsFolderPath}/app.log`, // Change this to your desired log file path
          },
        },
      },
    }),
    SubscriptionModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply to all routes or specific ones
  }
}

