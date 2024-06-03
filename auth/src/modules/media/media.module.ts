import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Media } from "./entities/media.entity";
import { MediaController } from "./controllers/media.controller";
import { MediaService } from "./services/media.service";
import { RoleService } from "../role/services/role.service";
import { Role } from "../role/entities/role.entity";
import { RoleModule } from "../role/role.module";
import { StorageModule } from "src/utils/azure/storage.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Media]),
        RoleModule,
        StorageModule
    ],
    controllers: [MediaController],
    providers: [
        MediaService,
        JwtService
    ],
    exports: [MediaService]
})

export class MediaModule { }
