import { Repository } from "typeorm";
import { Inject, NotFoundException } from "@nestjs/common";
import { DataBaseReturnType } from "src/types/databaseReturnType";
import { Role } from "../entities/role.entity";
import { RoleDTO } from "../dtos/role.dto";
import { InjectRepository } from "@nestjs/typeorm";

export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) { }

    async findAll() {
        try {
            const info = await this.roleRepository.find()
            if (info.length === 0) throw new NotFoundException('Role not found');

            return info
        } catch (error) {
            return error.response
        }
    }

    async findById(intId: number): Promise<Role> {
        try {
            const info = await this.roleRepository.findOneBy({ intId });
            if (!info) throw new NotFoundException('Role not found');

            return info
        } catch (error) {
            return error.response
        }
    }

    async create(roleDTO: RoleDTO) {
        try {
            const info = await this.roleRepository.save({
                strRoleName: roleDTO.strRoleName,
                intCreatedBy: roleDTO.intCreatedBy,
                dteCreatedAt: new Date,
                isActive: roleDTO.isActive
            })
            if (!info) throw new NotFoundException('Role can not be created. Please try again');

            return info
        } catch (error) {
            return error.response
        }
    }

    async update(intId: number, roleDTO: RoleDTO) {
        try {
            const role = await this.roleRepository.findOneBy({ intId })
            if (!role) throw new NotFoundException('Role not found');

            const info = await this.roleRepository.update(intId, roleDTO)
            if (!info) throw new NotFoundException('Role can not be updated. Please try again');

            return info 
        } catch (error) {
            return error.response
        }
    }

    async delete(intId: number) {
        try {
            const removeRole = await this.roleRepository.update(intId, {
                isActive: false
            })
            if (removeRole.affected === 0) {
                return removeRole as DataBaseReturnType
            }

            return removeRole as DataBaseReturnType
        } catch (error) {
            return error.response
        }
    }
}
