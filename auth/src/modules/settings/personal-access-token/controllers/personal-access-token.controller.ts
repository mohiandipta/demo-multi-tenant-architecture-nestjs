import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { PersonalAccessTokenService } from '../services/personal-access-token.service';
import { CreatePersonalAccessTokenDto } from '../dto/create-personal-access-token.dto';
import { UpdatePersonalAccessTokenDto } from '../dto/update-personal-access-token.dto';
import { requestInvalid, success } from 'src/helpers/http';
import { REQUEST_ERROR, SUCCESS } from 'src/shared/constants/httpCodes';
import { Roles } from 'src/middleware/role/roles.decorator';
import { RolesGuard } from 'src/middleware/role/roles.guard';

@Controller('personal-access-token')
export class PersonalAccessTokenController {
  constructor(
    private readonly personalAccessTokenService: PersonalAccessTokenService
  ) {}

  @Post('generate')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createPersonalAccessTokenDto: CreatePersonalAccessTokenDto
  ) {
    try {
      const data: any = await this.personalAccessTokenService.create(createPersonalAccessTokenDto)
      console.log(data)
      return response.status(SUCCESS).json(success(data))
    } catch (error) {
      throw error
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() {
    return this.personalAccessTokenService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findOne(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: number
  ) {
    try {
      const data: any = await this.personalAccessTokenService.findOne(+id);
      console.log(data)
      return response.status(SUCCESS).json(success(data))
    } catch (error) {
      throw error
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updatePersonalAccessTokenDto: UpdatePersonalAccessTokenDto) {
    return this.personalAccessTokenService.update(+id, updatePersonalAccessTokenDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.personalAccessTokenService.remove(+id);
  }
}
