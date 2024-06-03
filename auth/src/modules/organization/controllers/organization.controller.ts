import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { OrganizationService } from "../services/organization.service";
import { Roles } from "src/middleware/role/roles.decorator";
import { RolesGuard } from "src/middleware/role/roles.guard";
import { REQUEST_ERROR, SUCCESS } from "src/shared/constants/httpCodes";
import { requestInvalid, success } from "src/helpers/http";
import { handleInternalError } from "src/shared/error/handleInternalError";
import { OrganizationDTO } from "../dtos/organization.dto";

@Controller('organization')
export class OrganizationController {
    constructor(
        private organizationService: OrganizationService
    ) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin')
    async findAll(
        @Req() request: Request,
        @Res() response: Response
    ) {
        try {
            const data: any = await this.organizationService.findAll()

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            console.log(error);
            handleInternalError(error, response)
        }
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async findById(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number
    ) {
        try {
            const data: any = await this.organizationService.findById(id)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            console.log(error);
            return response.status(REQUEST_ERROR).json(requestInvalid(error))
        }
    }

    @Post('/create')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async create(
        @Req() request: Request,
        @Res() response: Response,
        @Body() organizationDTO: OrganizationDTO
    ) {
        try {
            const data: any = await this.organizationService.create(organizationDTO)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            console.log(error);
            return response.status(REQUEST_ERROR).json(requestInvalid(error))
        }
    }

    @Put('/update/:id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async update(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number,
        @Body() organizationDTO: OrganizationDTO
    ) {
        try {
            const data: any = await this.organizationService.update(id, organizationDTO)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            console.log(error);
            return response.status(REQUEST_ERROR).json(requestInvalid(error))
        }
    }
}
