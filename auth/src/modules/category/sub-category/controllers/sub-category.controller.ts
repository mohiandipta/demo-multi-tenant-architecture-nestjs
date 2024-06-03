import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { SubCategoryService } from '../services/sub-category.service';
import { CreateSubCategoryDto } from '../dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from '../dto/update-sub-category.dto';
import { MediaService } from 'src/modules/media/services/media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { requestInvalid, success } from 'src/helpers/http';
import { REQUEST_ERROR, SUCCESS } from 'src/shared/constants/httpCodes';
import { StorageService } from 'src/utils/azure/storage.service';
import { ExcelService } from 'src/utils/exim/excel.service';

@Controller('sub-category')
export class SubCategoryController {
  constructor(
    private readonly subCategoryService: SubCategoryService,
    private mediaService: MediaService,
    private readonly azureStorageService: StorageService,
    private excelService: ExcelService
  ) {}

  @Get()
  async findAll(
    @Req() request: Request, 
    @Res() response: Response
  ) {
    try {
      const data: any = await this.subCategoryService.findAll();
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const data: any = await this.subCategoryService.findOne(+id);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() subCategoryCreateDto: CreateSubCategoryDto,
    @Req() request: Request,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      subCategoryCreateDto = JSON.parse(request.body.data)
      const media = await this.mediaService.create(file, subCategoryCreateDto.intCreatedBy)
      console.log(media)
      const categoryData = {
        ...subCategoryCreateDto,
        strImageURL: media.strFileurl
      }

      const data: any = await this.subCategoryService.create(categoryData);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFromExcel(
    @Req() request: Request,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
    @Body() subCategoryCreateDto: CreateSubCategoryDto,
  ) {
    try {
      subCategoryCreateDto = JSON.parse(request.body.data)

      const fileBuffer = file.buffer
      const expectedHeaders = [
        'subCategoryName',
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

      const subCategoryDataArray = data.reduce((accumulator: CreateSubCategoryDto[], item) => {
        if (!encounteredNames.has(item.subCategoryName)) {
          const subCategoryData: CreateSubCategoryDto = {
            ...subCategoryCreateDto,
            strSubCategoryName: item.subCategoryName,
            strDescription: '',
            intCategoryId: 0,
            strImageURL: '',
            isActive: false
          };
          accumulator.push(subCategoryData);
          encounteredNames.add(item.subCategoryName);
        }
        return accumulator;
      }, []);

      const subCategoryJsonSave = await this.subCategoryService.create(subCategoryDataArray);

      return response.status(SUCCESS).json(success(subCategoryJsonSave));
    } catch (error) {
      throw error;
    }
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
    @Req() request: Request,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      updateSubCategoryDto = JSON.parse(request.body.data)
      const existingMedia = await this.subCategoryService.findOne(id)

      let updateSubCategoryData = { ...updateSubCategoryDto }

      if (updateSubCategoryDto.strImageURL === "") {
        await this.azureStorageService.deleteImage(existingMedia.strImageURL)

        const media = await this.mediaService.create(file, updateSubCategoryDto.intCreatedBy)

        updateSubCategoryData = {
          ...updateSubCategoryDto,
          strImageURL: media.strFileurl
        }
      }

      const data: any = await this.subCategoryService.update(
        +id,
        updateSubCategoryData,
      );
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  async remove(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const data: any = await this.subCategoryService.remove(+id);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }
}
