// src/tenant/tenant.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { DatabaseService } from 'src/database/ormconfig.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly databaseService: DatabaseService
  ) {}

  @Post('create')
  async createTenant(
    @Body() tenantDTO: CreateTenantDto
  ) {
    if (!tenantDTO) {
      throw new BadRequestException('Tenant name is required');
    }

    const response = await this.tenantService.create(tenantDTO)
    return response
  }
}
