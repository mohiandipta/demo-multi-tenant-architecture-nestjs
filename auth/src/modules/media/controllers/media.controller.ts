import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { Request, Response } from "express";
import { Roles } from "src/middleware/role/roles.decorator";
import { RolesGuard } from "src/middleware/role/roles.guard";
import { NOT_FOUND, REQUEST_ERROR, SUCCESS } from "src/shared/constants/httpCodes";
import { requestInvalid, success } from "src/helpers/http";
import { handleInternalError } from "src/shared/error/handleInternalError";
import { MediaService } from "../services/media.service";
import { MediaDTO } from "../dtos/media.dto";
import { StorageService } from "src/utils/azure/storage.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetUser } from "src/middleware/get-user/getUser.decorator";

@Controller('media')
export class MediaController {
    constructor(
        private mediaService: MediaService,
        private readonly azureStorageService: StorageService
    ) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin')
    async findAll(
        @Req() request: Request,
        @Res() response: Response
    ) {
        try {
            const data: any = await this.mediaService.findAll()

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async findById(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: string
    ) {
        try {
            const data: any = await this.mediaService.findById(id)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    @Post('create')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @Req() request: Request,
        @Res() response: Response,
        // @GetUser() user: any,
        @UploadedFile() file: Express.Multer.File
    ) {
        try {
            const mediaDTO: MediaDTO = JSON.parse(request.body.data)
            const data = await this.mediaService.create(file, mediaDTO.intCreatedBy)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            console.log(error);
            throw error
        }
    }


    @Delete('delete/:id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async delete(
        @Param('id') id: string,
        @Res() response: Response
    ) {
        try {
            const existingMedia = await this.mediaService.findById(id);

            const blobDlt = await this.azureStorageService.deleteImage(existingMedia.strFileurl)
            if (blobDlt) {
                await this.mediaService.delete(existingMedia.uuid)
            }

            return response.status(SUCCESS).json(existingMedia);
        } catch (error) {
            throw error
        }
    }

    @Delete('delete-by-uuid/:uuid')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async deleteByUUID(
        @Param('uuid') uuid: string,
        @Res() response: Response
    ) {
        try {
            const data = await this.mediaService.deleteByUUID(uuid)

            return response.status(SUCCESS).json(data);
        } catch (error) {
            throw error
        }
    }


    @Put('/update/:id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async update(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: string,
        @Body() mediaDTO: MediaDTO
    ) {
        try {
            const data: any = await this.mediaService.update(id, mediaDTO)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
