import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from '../media/media.module';
import { StorageModule } from 'src/utils/azure/storage.module';
import { ExcelService } from 'src/utils/exim/excel.service';
import { MyGateway } from 'src/socket.io/gateway';
import { SubCategory } from './sub-category/entities/sub-category.entity';
import { RoleModule } from '../role/role.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    SubCategoryModule,
    MediaModule,
    StorageModule,
    RoleModule,
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService, 
    ExcelService, 
    MyGateway,
    JwtService
  ],
  exports: [CategoryService]
})
export class CategoryModule {}
