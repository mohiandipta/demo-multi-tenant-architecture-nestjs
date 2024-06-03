import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Organization } from "../entities/organization.entity";
import { privateDecrypt } from "crypto";
import { Repository } from "typeorm";
import { OrganizationDTO } from "../dtos/organization.dto";

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(Organization)
        private organizationRepository: Repository<Organization>
    ) { }

    async findAll() {
        try {
            const organizationInfo = await this.organizationRepository.find()
            if (organizationInfo.length === 0) throw new NotFoundException('Organization not found');

            return {
                statusCode: 200,
                data: organizationInfo
            }
        } catch (error) {
            return error.response
        }
    }

    async findById(intId: number) {
        try {
            const organizationInfo = await this.organizationRepository.findOneBy({ intId });
            if (!organizationInfo) throw new NotFoundException('Organization can not found by this id!');

            return {
                statusCode: 200,
                data: organizationInfo
            }
        } catch (error) {
            return error.response
        }
    }

    async create(organizationDTO: OrganizationDTO) {
        try {
            const organizationInfo = await this.organizationRepository.save(organizationDTO)
            if (!organizationInfo) throw new NotFoundException('Warranty can not be created. Please try again');

            return organizationInfo
        } catch (error) {
            return error.response
        }
    }

    async update(intId: number, organizationDTO: OrganizationDTO) {
        try {
            const organizationInfo = await this.organizationRepository.findOneBy({ intId });
            if (!organizationInfo) throw new NotFoundException('Organization not found');

            const info = await this.organizationRepository.update(intId, organizationDTO)
            if (!info) throw new NotFoundException('Organization can not be updated. Please try again');

            return info
        } catch (error) {
            return error.response
        }
    }

    async delete(intId: number) {
        try {
            const organizationInfo = await this.organizationRepository.findOneBy({ intId });
            if (!organizationInfo) throw new NotFoundException('Organization not found');

            const info = await this.organizationRepository.delete(intId);
            if (!info) throw new NotFoundException('Organization can not be deleted. Please try again');

            return {
                statusCode: 200,
                data: info
            };
        }
        catch (error) {
            return error.response
        }
    }
}
