import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Put, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { requestInvalid, success } from 'src/helpers/http';
import { REQUEST_ERROR, SUCCESS } from 'src/shared/constants/httpCodes';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from 'src/modules/media/services/media.service';
import { MediaDTO } from 'src/modules/media/dtos/media.dto';
import { StorageService } from 'src/utils/azure/storage.service';
import { ExcelService } from 'src/utils/exim/excel.service';
import { Roles } from 'src/middleware/role/roles.decorator';
import { RolesGuard } from 'src/middleware/role/roles.guard';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private mediaService: MediaService,
    private readonly azureStorageService: StorageService,
    private excelService: ExcelService
  ) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAll(@Req() request: Request, @Res() response: Response) {
    try {
      const data: any = await this.categoryService.findAll();
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }


  @Get('all-cat-sub-cat')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllCategoryBySubcategory(
    @Req() request: Request,
    @Res() response: Response
  ) {
    try {
      const data: any = await this.categoryService.getAllCategoryBySubcategory();
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findOne(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const data: any = await this.categoryService.findOne(+id);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() categoryCreateDto: CreateCategoryDto,
    @Req() request: Request,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      categoryCreateDto = JSON.parse(request.body.data)
      const media = await this.mediaService.create(file, categoryCreateDto.intCreatedBy)
      console.log(media)
      const categoryData = {
        ...categoryCreateDto,
        strImageURL: media.strFileurl
      }

      const data: any = await this.categoryService.create(categoryData);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Post('upload')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFromExcel(
    @Req() request: Request,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
    @Body() categoryCreateDto: CreateCategoryDto,
  ) {
    try {
      categoryCreateDto = JSON.parse(request.body.data)

      const fileBuffer = file.buffer
      const expectedHeaders = [
        'categoryName'
      ]

      const fileName = file.originalname
      const extension = fileName.split('.').pop()?.toLowerCase();

      const data: any = await this.excelService.readExcel(
        fileBuffer,
        expectedHeaders,
        extension
      )
      if (data.statusCode && data.statusCode === 400) {
        return response.status(REQUEST_ERROR).json(requestInvalid(data.message));
      }

      const encounteredNames = new Set<string>();

      const categoryDataArray = data.reduce((accumulator: CreateCategoryDto[], item) => {
        if (!encounteredNames.has(item.categoryName)) {
        const categoryData: CreateCategoryDto = {
          ...categoryCreateDto,
          strCategoryName: item.categoryName,
          strDescription: "",
          strImageURL: "",
          isActive: false
        };
          accumulator.push(categoryData);
          encounteredNames.add(item.categoryName);
        }
        return accumulator;
      }, []);

      const categoryJsonSave = await this.categoryService.create(categoryDataArray);

      return response.status(SUCCESS).json(success(categoryJsonSave));
    } catch (error) {
      throw error;
    }
  }

  @Put('update/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() request: Request,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      updateCategoryDto = JSON.parse(request.body.data)
      const existingMedia = await this.categoryService.findOne(id)

      let updateCategoryData = { ...updateCategoryDto }

      if (updateCategoryDto.strImageURL === "") {
        await this.azureStorageService.deleteImage(existingMedia.strImageURL)

        const media = await this.mediaService.create(file, updateCategoryDto.intCreatedBy)

        updateCategoryData = {
          ...updateCategoryDto,
          strImageURL: media.strFileurl
        }
      }

      const data: any = await this.categoryService.update(
        +id,
        updateCategoryData,
      );
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async remove(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const data: any = await this.categoryService.remove(+id);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }
}
