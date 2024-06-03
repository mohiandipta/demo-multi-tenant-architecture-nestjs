import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import * as fs from 'fs';
import { ConfigModule } from '@nestjs/config';
import { TenantMiddleware } from './middleware/tenant/tenant.middleware';
import { TenantModule } from './modules/tenant/tenant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database/ormconfig.service';

const logsFolderPath = 'logs';

// Ensure the logs folder exists, create it if not
if (!fs.existsSync(logsFolderPath)) {
  fs.mkdirSync(logsFolderPath);
}

const databaseService = new DatabaseService()

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseService.getAdminDataSourceOptions()),
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
    TenantModule
  ],
  controllers: [],
  providers: [
    Logger
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(TenantMiddleware)
    //   .exclude({  
    //     method: RequestMethod.POST, path: 'auth/login'
    //   })
    //   .forRoutes('*')
  }
}

