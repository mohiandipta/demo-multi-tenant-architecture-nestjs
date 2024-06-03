import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { CreateDashboardDto } from '../dto/create-dashboard.dto';
import { UpdateDashboardDto } from '../dto/update-dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  
}
