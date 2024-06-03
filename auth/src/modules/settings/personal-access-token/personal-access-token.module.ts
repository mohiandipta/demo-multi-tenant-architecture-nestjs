import { Module } from '@nestjs/common';
import { PersonalAccessTokenService } from './services/personal-access-token.service';
import { PersonalAccessTokenController } from './controllers/personal-access-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalAccessToken } from './entities/personal-access-token.entity';
import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonalAccessToken]),
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '8h' }, // default expiration if needed
      }),
    }),
    AuthModule,
    RoleModule
  ],
  controllers: [PersonalAccessTokenController],
  providers: [
    PersonalAccessTokenService,
    JwtStrategy,
    JwtService,
  ],
  exports: [PersonalAccessTokenService, JwtModule]
})
export class PersonalAccessTokenModule {}
