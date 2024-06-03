import { Controller, Get, Req, Res, Param, Post, Body, Put, Delete, UseInterceptors, UploadedFile, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { notFound, success, requestInvalid } from "src/helpers/http";
import { SUCCESS, REQUEST_ERROR } from "src/shared/constants/httpCodes";
import { handleInternalError } from "src/shared/error/handleInternalError";
import { UserInfoService } from "../services/userInfo.service";
import { UserInfoDTO } from "../dtos/userInfo.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageService } from "src/utils/azure/storage.service";
import { Roles } from "src/middleware/role/roles.decorator";
import { RolesGuard } from "src/middleware/role/roles.guard";
import { GetUser } from "src/middleware/get-user/getUser.decorator";
// import { compressImage } from "src/utils/imgCompressor";

@Controller('user-info')
export class UserInfoController {
  constructor(
    private readonly userInfoService: UserInfoService,
    private azureStorageService: StorageService
  ) { }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAll(
    @Req() request: Request,
    @Res() response: Response,
    @GetUser() user: any
  ) {
    try {
      const data: any = await this.userInfoService.findAll(user.organizationId)

      return response.status(SUCCESS).json(success(data))
    } catch (error) {
      console.log(error);
      handleInternalError(error, response)
    }
  }

  @Get('service-Man')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findServiceMan(
    @Req() request: Request,
    @Res() response: Response,
    @GetUser() user: any
  ) {
    try {
      console.log("organizationId", user.organizationId)
      const data: any = await this.userInfoService.findServiceMan(user.organizationId)

      return response.status(SUCCESS).json(success(data))
    } catch (error) {
      console.log(error);
      handleInternalError(error, response)
    }
  }

  @Get('retailer')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findRetailer(
    @Req() request: Request,
    @Res() response: Response,
    @GetUser() user: any
  ) {
    try {
      const data: any = await this.userInfoService.findRetailer(user.organizationId)

      return response.status(SUCCESS).json(success(data))
    } catch (error) {
      console.log(error);
      handleInternalError(error, response)
    }
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'Service-man', 'Customer')
  async findById(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: number
  ) {
    try {
      const data: any = await this.userInfoService.findById(id)

      return response.status(SUCCESS).json(success(data))
    } catch (error) {
      console.log(error);
      return response.status(REQUEST_ERROR).json(requestInvalid(error))
    }
  }

  @Post('create')
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() userInfoDTO: UserInfoDTO
  ) {
    try {
      const data: any = await this.userInfoService.createUserInfo(userInfoDTO)

      return response.status(SUCCESS).json(success(data))
    } catch (error) {
      console.log(error);
      return response.status(REQUEST_ERROR).json(requestInvalid(error))
    }
  }


  @Put('update/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'Service-man', 'Customer')
  async updateReference(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: number,
    @Body() userInfoDTO: UserInfoDTO,
  ) {
    try {
      const data = await this.userInfoService.updateUserInfo(id, userInfoDTO);

      return response.status(SUCCESS).json(success(data))
    } catch (error) {
      return response.status(REQUEST_ERROR).json(requestInvalid(error))
    }
  }

  @Put('update/role/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateRole(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: number,
    @Body('intRoleId') intRoleId: number,
  ) {
    try {
      const data = await this.userInfoService.updateRole(id, intRoleId);

      return response.status(SUCCESS).json(success(data))
    } catch (error) {
      return response.status(REQUEST_ERROR).json(requestInvalid(error))
    }
  }

  @Delete('delete/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async deleteReference(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: number
  ) {
    try {
      const data: any = await this.userInfoService.deleteUserInfo(id)

      return response.status(SUCCESS).json(success(data))
    } catch (error) {
      return response.status(REQUEST_ERROR).json(requestInvalid(error))
    }
  }
};
