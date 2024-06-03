import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from "@nestjs/common";;
import { Request, Response } from "express";
import { handleInternalError } from "src/shared/error/handleInternalError";
import { notFound, requestInvalid, success } from "src/helpers/http";
import { REQUEST_ERROR, SUCCESS } from "src/shared/constants/httpCodes";
import { SubscriptionService } from "../services/subscription.service";
import { SubscriptionDTO } from "../dtos/subscription.dto";

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Get()
    async findAll(
        @Req() request: Request,
        @Res() response: Response
    ) {
        try {
            const data: any = await this.subscriptionService.findAll()
            if (data.length === 0) {
                return response.status(404).json(notFound('No Subscription found'))
            }
            else {
                return response.status(SUCCESS).json(success(data))
            }
        } catch (error) {
            console.log(error);
            handleInternalError(error, response)
        }
    }

    @Get(':id')
    async findById(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number
    ) {
        try {
            const data: any = await this.subscriptionService.findById(id)
            if (data === null) {
                return response.status(404).json(notFound('No Subscription found'))
            }
            else {
                return response.status(SUCCESS).json(success(data))
            }
        } catch (error) {
            console.log(error);
            return response.status(REQUEST_ERROR).json(requestInvalid(error))
        }
    }

    @Post('create')
    async create(
        @Req() request: Request,
        @Res() response: Response,
        @Body() subscriptionDTO: SubscriptionDTO
    ) {
        try {
            const data: any = await this.subscriptionService.createSubscription(subscriptionDTO)
            if (data?.status === 400) {
                return response.status(REQUEST_ERROR).json(requestInvalid(data))
            }
            else {
                return response.status(SUCCESS).json(success(data))
            }
        } catch (error) {
            console.log(error);
            return response.status(REQUEST_ERROR).json(requestInvalid(error))
        }
    }

    @Put('update/:id')
    async updateSubscription(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number,
        @Body() subscriptionDTO: SubscriptionDTO
    ) {
        try {
            const data = await this.subscriptionService.updateSubscription(id, subscriptionDTO);
            if (data?.status === 404) {
                return response.status(404).json(notFound(data?.message))
            }
            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error))
        }
    }

    @Delete('delete/:id')
    async deleteSubscription(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number
    ) {
        try {
            const data: any = await this.subscriptionService.deleteSubscription(id)
            if (data?.status === 404) {
                return response.status(404).json(notFound('Subscription not found'))
            }
            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error))
        }
    }
}

