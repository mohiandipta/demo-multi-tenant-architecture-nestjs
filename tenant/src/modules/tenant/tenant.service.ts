import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { DatabaseService } from 'src/database/ormconfig.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private readonly databaseService: DatabaseService
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    const message = await this.databaseService.createTenantDatabase((createTenantDto.strName).trim());

    await this.tenantRepository.save(createTenantDto)
    return message;
  }

  findAll() {
    return `This action returns all tenant`;
  }

  async findOneByName(tenantName: string) {
    // await this.tenantRepository.findOneBy({ tenantName })
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
}
