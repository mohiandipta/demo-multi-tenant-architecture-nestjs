import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from "./jwt.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoginInfo } from "./entities/auth.entity";
import { UserInfoService } from "../users/services/userInfo.service";
import { UserInfo } from "../users/entities/userInfo.entity";
import { RoleService } from "../role/services/role.service";
import { Role } from "../role/entities/role.entity";
import { userInfo } from "os";
import { OrganizationModule } from "../organization/organization.module";
import { StorageService } from "src/utils/azure/storage.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            LoginInfo,
            UserInfo,
            Role]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'f44fd4f46s4fv64sf5v45f44s5f4v5s44vssd1S2', // Change this to your actual secret key
            signOptions: { expiresIn: '8h' }, // Token expiration time
        }),
        OrganizationModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        UserInfoService,
        RoleService,
        StorageService
    ],
    exports: [AuthService, PassportModule, JwtModule]
})

export class AuthModule { }
