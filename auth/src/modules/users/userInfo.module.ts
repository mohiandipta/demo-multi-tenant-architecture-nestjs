import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from './entities/userInfo.entity';
import { UserInfoService } from './services/userInfo.service';
import { UserInfoController } from './controllers/userInfo.controller';
import { StorageService } from 'src/utils/azure/storage.service';
import { JwtService } from '@nestjs/jwt';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInfo]),
    RoleModule
  ],
  controllers: [UserInfoController],
  providers: [
    UserInfoService,
    JwtService,
    StorageService
  ],
  exports: [UserInfoService]
})

export class UserInfoModule { }
