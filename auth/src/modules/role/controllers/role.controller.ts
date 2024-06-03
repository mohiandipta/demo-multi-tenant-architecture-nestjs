import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { REQUEST_ERROR, SUCCESS } from "src/shared/constants/httpCodes";
import { notFound, requestInvalid, success } from "src/helpers/http";
import { RoleService } from "../services/role.service";
import { RoleDTO } from "../dtos/role.dto";
import { RolesGuard } from "src/middleware/role/roles.guard";
import { Roles } from "src/middleware/role/roles.decorator";

@Controller('role')
export class RoleController {
    constructor(
        private readonly roleService: RoleService
    ) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin')
    async findAll(
        @Req() request: Request,
        @Res() response: Response
    ) {
        try {
            const data = await this.roleService.findAll()

            return response.status(SUCCESS).json(success(data));
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error));
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
            const data: any = await this.roleService.findById(id);

            return response.status(SUCCESS).json(success(data));
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error));
        }
    }

    @Post('create')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async createMenu(
        @Req() request: Request,
        @Res() response: Response,
        @Body() roleDTO: RoleDTO
    ) {
        try {
            const data: any = await this.roleService.create(roleDTO)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error));
        }
    }

    @Put('update/:id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async updateMenu(
        @Param('id') id: number,
        @Body() roleDTO: RoleDTO,
        @Req() request: Request,
        @Res() response: Response
    ) {
        try {
            const data: any = await this.roleService.update(id, roleDTO)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error));
        }
    }

    @Delete('delete/:id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async deleteMenu(
        @Param('id') id: number,
        @Req() request: Request,
        @Res() response: Response
    ) {
        try {
            const data: any = await this.roleService.delete(id)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error));
        }
    }
}
