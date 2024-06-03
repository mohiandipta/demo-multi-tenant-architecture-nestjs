import { Module } from "@nestjs/common";
import { OrganizationController } from "./controllers/organization.controller";
import { OrganizationService } from "./services/organization.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./entities/organization.entity";
import { JwtService } from "@nestjs/jwt";
import { RoleService } from "../role/services/role.service";
import { Role } from "../role/entities/role.entity";
import { RoleModule } from "../role/role.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Organization]),
        RoleModule
    ],
    controllers: [OrganizationController],
    providers: [
        OrganizationService,
        JwtService,
    ],
    exports: [OrganizationService]
})

export class OrganizationModule { }
