import { Module } from '@nestjs/common';
import { PersonalAccessTokenModule } from './personal-access-token/personal-access-token.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PersonalAccessTokenController } from './personal-access-token/controllers/personal-access-token.controller';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    AuthModule,
    PersonalAccessTokenModule,
    RoleModule,
  ],
  controllers: [
    PersonalAccessTokenController
  ],
  providers: [
    JwtService
  ],
  exports: []
})
export class SettingsModule {}
