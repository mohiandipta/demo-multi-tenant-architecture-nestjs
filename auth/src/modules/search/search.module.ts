import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { JwtService } from '@nestjs/jwt';
import { MediaModule } from '../media/media.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '../media/entities/media.entity';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media]),
    RoleModule
  ],
  controllers: [SearchController],
  providers: [
    SearchService,
    JwtService
  ],
  exports: [SearchService]
})
export class SearchModule {}
