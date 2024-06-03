import { Module } from '@nestjs/common';
import { SubCategoryService } from './services/sub-category.service';
import { SubCategoryController } from './controllers/sub-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { MediaModule } from 'src/modules/media/media.module';
import { StorageModule } from 'src/utils/azure/storage.module';
import { MyGateway } from 'src/socket.io/gateway';
import { ExcelService } from 'src/utils/exim/excel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategory]),
    MediaModule,
    StorageModule
  ],
  controllers: [SubCategoryController],
  providers: [
    SubCategoryService,
    ExcelService,
    MyGateway
  ],
  exports: [SubCategoryService]
})
export class SubCategoryModule {}
