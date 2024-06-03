import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Put, UseInterceptors, UploadedFile, UploadedFiles, UseGuards } from '@nestjs/common';
import { Request, Response } from "express";
import { ProductService } from './product.service';
import { ProductDto } from './dto/create-product.dto';
import { ERROR, REQUEST_ERROR, SUCCESS } from 'src/shared/constants/httpCodes';
import { requestInvalid, success } from 'src/helpers/http';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from 'src/modules/media/services/media.service';
import { StorageService } from 'src/utils/azure/storage.service';
import { ExcelService } from 'src/utils/exim/excel.service';
import { Roles } from 'src/middleware/role/roles.decorator';
import { RolesGuard } from 'src/middleware/role/roles.guard';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService,
    private mediaService: MediaService,
    private readonly azureStorageService: StorageService,
    private excelService: ExcelService
  ) { }

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'highQ', maxCount: 1 },
    { name: 'lowQ', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
  ]))
  async uploadFile(
    @UploadedFiles() files: {
      thumbnail?: Express.Multer.File[],
      highQ?: Express.Multer.File[],
      lowQ?: Express.Multer.File[],
      icon?: Express.Multer.File[]
    },
    @Body() productDto: ProductDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      productDto = JSON.parse(request.body.data)
      const uploadPromises = [];


      const isProductExistbySlug = await this.productService.checkIsExistProductBySlug(productDto.strSlug)
      if (isProductExistbySlug) return response.status(200).json('product already exist using this slug!');

      const uploadFileIfExist = async (file, fieldName, mediaService) => {
        if (file?.length && file[0].fieldname === fieldName) {
          const media = await mediaService.create(file[0], productDto.intLastActionBy);
          return { uuid: media.uuid, url: media.strFileurl };
        }
        return { uuid: 'n/a', url: 'n/a' };
      };

      uploadPromises.push(uploadFileIfExist(files.thumbnail, 'thumbnail', this.mediaService));
      uploadPromises.push(uploadFileIfExist(files.highQ, 'highQ', this.mediaService));
      uploadPromises.push(uploadFileIfExist(files.lowQ, 'lowQ', this.mediaService));
      uploadPromises.push(uploadFileIfExist(files.icon, 'icon', this.mediaService));

      const [
        thumbnailUpload,
        highQUpload,
        lowQUpload,
        iconUpload,
      ] = await Promise.all(uploadPromises);

      const productData = {
        ...productDto,
        strThumbnailUuid: thumbnailUpload.uuid,
        strThumbnailUrl: thumbnailUpload.url,
        strHighQUuid: highQUpload.uuid,
        strHighQUrl: highQUpload.url,
        strLowQUuid: lowQUpload.uuid,
        strLowQUrl: lowQUpload.url,
        strIconUuid: iconUpload.uuid,
        strIconUrl: iconUpload.url
      };

      // console.log('productData => ', productData);
      const productInfo = await this.productService.create(productData);
      return response.status(200).json(productInfo);
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAll(
    @Req() request: Request,
    @Res() response: Response) {
    try {
      const allproducts = await this.productService.findAll();
      return response.status(SUCCESS).json(success(allproducts));
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  @Get('/active-products')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAllActive(
    @Req() request: Request,
    @Res() response: Response) {
    try {
      const allactiveproducts = await this.productService.findAllActiveProducts();
      return response.status(SUCCESS).json(success(allactiveproducts));
    } catch (error) {
      throw error
    }
  }

  @Get('/inactive')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAllInactive(
    @Req() request: Request,
    @Res() response: Response) {
    try {
      const allinactiveproducts = await this.productService.findAllInActiveProduct();
      return response.status(SUCCESS).json(success(allinactiveproducts));
    } catch (error) {
      throw error
    }
  }

  @Get('/find-by-slug/:slug')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findOnebySlug(
    @Req() request: Request,
    @Res() response: Response,
    @Param('slug') slug: string) {
    try {
      const productBySlug = await this.productService.findByProductSlug(slug);
      return response.status(SUCCESS).json(success(productBySlug));

    } catch (error) {
      throw error
    }
  }

  @Get('/featured-product')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findFeaturedProduct(
    @Req() request: Request,
    @Res() response: Response) {
    try {
      const productBySlug = await this.productService.findByFeaturedProduct();
      return response.status(SUCCESS).json(success(productBySlug));

    } catch (error) {
      throw error
    }
  }

  @Get('/find-by-category/:categoryId')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findOnebyCategory(
    @Req() request: Request,
    @Res() response: Response,
    @Param('categoryId') categoryId: number) {
    try {
      const productByCategory = await this.productService.findByCategory(categoryId);
      return response.status(SUCCESS).json(success(productByCategory));
    } catch (error) {
      throw error
    }
  }

  @Get('/find-by-subCategory/:subCategoryId')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findOnebySubCategory(
    @Req() request: Request,
    @Res() response: Response,
    @Param('subCategoryId') subCategoryId: number) {
    try {
      const productBySubCategory = await this.productService.findBySubCategory(subCategoryId);
      return response.status(SUCCESS).json(success(productBySubCategory));
    } catch (error) {
      throw error
    }
  }

  @Get('/find-by-additional-Category/:additionalCategoryId')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findOnebyAdditionalCategory(
    @Req() request: Request,
    @Res() response: Response,
    @Param('additionalCategoryId') additionalCategoryId: number) {
    try {
      const productByAdditionalCategory = await this.productService.findByAdditionalCategory(additionalCategoryId);
      return response.status(SUCCESS).json(success(productByAdditionalCategory));
    } catch (error) {
      throw error
    }
  }

  @Get(':uuid')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findOne(
    @Req() request: Request,
    @Res() response: Response,
    @Param('uuid') uuid: string) {
    try {
      const productByuuid = await this.productService.findById(uuid);
      return response.status(SUCCESS).json(success(productByuuid));
    } catch (error) {
      throw error
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
    @Body() productCreateDto: ProductDto,
  ) {
    try {
      productCreateDto = JSON.parse(request.body.data)

      const fileBuffer = file.buffer
      const expectedHeaders = [
        'item',
        '_id',
        'slug',
        'price',
        'mrpprice'
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

      const productDataArray = data.reduce((accumulator: ProductDto[], item) => {
        if (!encounteredNames.has(item.item)) {
          const productData: ProductDto = {
            ...productCreateDto,
            uuid: item._id,
            strItem: item.item,
            strSlug: item.slug,
            decMrpPrice: item.mrpprice,
            decOfferPrice: item.price,
            isFeatured: false,
            isActive: true,
          };
          accumulator.push(productData);
          encounteredNames.add(item.item);
        }
        return accumulator;
      }, []);

      console.log(productDataArray)
      
      const productJsonSave = await this.productService.create(productDataArray);

      return response.status(SUCCESS).json(success(productJsonSave));
    } catch (error) {
      throw error;
    }
  }

  @Put('/update-by-uuid/:uuid')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'highQ', maxCount: 1 },
    { name: 'lowQ', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
  ]))
  async update(
    @UploadedFiles() files: {
      thumbnail?: Express.Multer.File[],
      highQ?: Express.Multer.File[],
      lowQ?: Express.Multer.File[],
      icon?: Express.Multer.File[]
    },
    @Req() request: Request,
    @Res() response: Response,
    @Param('uuid') uuid: string,
    @Body() productDto: ProductDto) {
    try {
      productDto = JSON.parse(request.body.data)
      const existingMedia = await this.productService.findById(uuid)

      let thumbnailUpload, highQUpload, lowQUpload, iconUpload, productData = { ...productDto }

      //url doesn't exist and new thumbnail will upload
      if (productDto.strThumbnailUrl === "") {
        try {
          // Attempt to delete the image from Azure if the URL is valid
          if (existingMedia.strThumbnailUrl) {
            await this.azureStorageService.deleteImage(existingMedia.strThumbnailUrl);
          } else {
            console.warn("No valid thumbnail URL found to delete.");
          }
        } catch (error) {
          // If there's an error, log it and continue
          console.error("Error deleting image from Azure:", error);
        }
      
        // Ensure that files.thumbnail is defined and has at least one element
        if (files.thumbnail && files.thumbnail[0]) {
          thumbnailUpload = await this.mediaService.create(files.thumbnail[0], productDto.intLastActionBy);
      
          productData = {
            ...productDto,
            strThumbnailUuid: thumbnailUpload.uuid,
            strThumbnailUrl: thumbnailUpload.strFileurl,
          };
        } else {
          console.error("No valid thumbnail file found to upload.");
        }
      }
      // if (productDto.strThumbnailUrl === "") {
      //   try {
      //     // Attempt to delete the image from Azure
      //     await this.azureStorageService.deleteImage(existingMedia.strThumbnailUrl);
      //   } catch (error) {
      //     // If there's an error, log it and continue
      //     console.error("Error deleting image from Azure:", error);
      //   }
      //   console.log(files.thumbnail[0])
      //   thumbnailUpload = await this.mediaService.create(files.thumbnail[0], productDto.intLastActionBy);

      //   productData = {
      //     ...productDto,
      //     strThumbnailUuid: thumbnailUpload.uuid,
      //     strThumbnailUrl: thumbnailUpload.strFileurl,
      //   };
      // }
      //url exist and no need for thumbnail upload
      if (productDto.strThumbnailUrl !== "") {
        //furthure development
      }

      if (productDto.strHighQUrl === "") {
        try {
          // Attempt to delete the image from Azure
          await this.azureStorageService.deleteImage(existingMedia.strHighQUrl)
        } catch (error) {
          // If there's an error, log it and continue
          console.error("Error deleting image from Azure:", error);
        }

        if (files.highQ && files.highQ[0]) {
          highQUpload = await this.mediaService.create(files.highQ[0], productDto.intLastActionBy);

          productData = {
            ...productDto,
            strHighQUuid: highQUpload.uuid,
            strHighQUrl: highQUpload.strFileurl,
          };
        } else {
          console.error("No valid HighQ file found to upload.");
        }
      }

      if (productDto.strHighQUrl !== "") {
        //furthure development
      }

      if (productDto.strLowQUrl === "") {
        try {
          // Attempt to delete the image from Azure
          await this.azureStorageService.deleteImage(existingMedia.strLowQUrl)
        } catch (error) {
          // If there's an error, log it and continue
          console.error("Error deleting image from Azure:", error);
        }

        if (files.lowQ && files.lowQ[0]) {
          // lowQUpload = uploadPromises.push(uploadFileIfExist(files.lowQ, 'lowQ', this.mediaService));
          lowQUpload = await this.mediaService.create(files.lowQ[0], productDto.intLastActionBy);
          // console.log('media lowQ => ', media);

          productData = {
            ...productDto,
            strLowQUuid: lowQUpload.uuid,
            strLowQUrl: lowQUpload.strFileurl,
          };
        } else {
          console.error("No valid LowQ file found to upload.");
        }
      }

      if (productDto.strLowQUrl !== "") {
        //furthure development
      }
      console.log("product updated ", productData)

      const updateProductInfo = await this.productService.update(uuid, productData);
      return response.status(SUCCESS).json(success(updateProductInfo))
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Patch('/stockUpdatebyUuid/:uuid/:stockStatus')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async stockUpdate(
    @Req() request: Request,
    @Res() response: Response,
    @Param('uuid') uuid: string,
    @Param('stockStatus') stockStatus: boolean) {
    try {
      const data = await this.productService.updateStockStatus(uuid, stockStatus);

      if (data.affected === 1) {
        return response.status(SUCCESS).json({ data, message: 'product stock Updated Successfully' });
      } else {
        return response.status(ERROR).json(data);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }

  }

  @Patch('/statusUpdatebyUuid/:uuid/:status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async productStatusUpdate(
    @Req() request: Request,
    @Res() response: Response,
    @Param('uuid') uuid: string,
    @Param('status') status: boolean) {
    const data = await this.productService.updateProductStatus(uuid, status);

    if (data.affected === 1) {
      return response.status(SUCCESS).json({ data, message: 'product Status Updated Successfully' });
    } else {
      return response.status(ERROR).json(data);
    }
  }
}
