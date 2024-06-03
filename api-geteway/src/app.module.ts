import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProxyMiddleware } from './middleware/proxy.middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProxyMiddleware).forRoutes('*');
  }
}
