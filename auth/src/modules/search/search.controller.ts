import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, Query } from '@nestjs/common';
import { Request, Response } from "express";
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { success } from 'src/helpers/http';
import { Roles } from 'src/middleware/role/roles.decorator';
import { RolesGuard } from 'src/middleware/role/roles.guard';
import { SUCCESS } from 'src/shared/constants/httpCodes';
import { handleInternalError } from 'src/shared/error/handleInternalError';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
  ) {}

  @Get('media')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async searchMedia(
    @Req() request: Request,
    @Res() response: Response,
    @Query('keyword') keyword: string
  ) {
    try {
      const data: any = await this.searchService.searchMedia(keyword)
      console.log(data)

      return response.status(SUCCESS).json(success(data))
    } catch (error) {
      console.log(error);
      handleInternalError(error, response)
    }
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() createSearchDto: CreateSearchDto) {
    // return this.searchService.create(createSearchDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() {
    return this.searchService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.searchService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateSearchDto: UpdateSearchDto) {
    return this.searchService.update(+id, updateSearchDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.searchService.remove(+id);
  }
}
