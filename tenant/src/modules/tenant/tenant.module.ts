import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { DatabaseService } from 'src/database/ormconfig.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]),],
  controllers: [TenantController],
  providers: [TenantService, DatabaseService],
})
export class TenantModule {}
