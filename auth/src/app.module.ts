import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';
import * as fs from 'fs';
import { AuthModule } from './modules/auth/auth.module';
import { AccessControlMiddleware } from './middleware/access-control/accessControl.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import configService from './database/ormconfig.service';
import { UserInfoModule } from './modules/users/userInfo.module';
import { RoleModule } from './modules/role/role.module';
import { StorageModule } from './utils/azure/storage.module';
import { RoleService } from './modules/role/services/role.service';
import { GateWayModule } from './socket.io/gateway.module';
import { REQUEST } from '@nestjs/core';
import { TenantMiddleware } from './middleware/tenant/tenant.middleware';

const logsFolderPath = 'logs';

// Ensure the logs folder exists, create it if not
if (!fs.existsSync(logsFolderPath)) {
  fs.mkdirSync(logsFolderPath);
}

@Module({
  imports: [
    // TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forRootAsync({
      useFactory: async (request: Request) => {
        const tenant = request['tenant'];
        return configService.getTypeOrmConfig(tenant);
      },
      inject: [REQUEST],
    }),
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
    AuthModule,
    UserInfoModule,
    RoleModule,
    StorageModule,
    GateWayModule,
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

