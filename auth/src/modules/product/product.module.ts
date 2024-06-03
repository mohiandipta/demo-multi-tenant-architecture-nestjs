import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { StorageModule } from 'src/utils/azure/storage.module';
import { MediaModule } from '../media/media.module';
import { ExcelService } from 'src/utils/exim/excel.service';
import { MyGateway } from 'src/socket.io/gateway';
import { RoleModule } from '../role/role.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    MediaModule,
    StorageModule,
    RoleModule
  ],

  controllers: [ProductController],
  providers: [
    ProductService,
    ExcelService,
    MyGateway,
    JwtService
  ],
  exports: [ProductService]
})
export class ProductModule { }
