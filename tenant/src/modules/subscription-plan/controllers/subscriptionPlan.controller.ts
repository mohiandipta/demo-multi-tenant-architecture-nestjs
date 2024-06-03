import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from "@nestjs/common";;
import { Request, Response } from "express";
import { handleInternalError } from "src/shared/error/handleInternalError";
import { notFound, requestInvalid, success } from "src/helpers/http";
import { REQUEST_ERROR, SUCCESS } from "src/shared/constants/httpCodes";
import { SubscriptionPlanDTO } from "../dtos/subscriptionPlan.dto";
import { SubscriptionPlanService } from "../services/subscriptionPlan.service";

@Controller('subscription-plan')
export class SubscriptionPlanController {
    constructor(private readonly subscriptionPlanService: SubscriptionPlanService) { }

    @Get()
    async findAll(
        @Req() request: Request,
        @Res() response: Response
    ) {
        try {
            const data: any = await this.subscriptionPlanService.findAll()
            if (data.length === 0) {
                return response.status(404).json(notFound('No Subscription plan found'))
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
            const data: any = await this.subscriptionPlanService.findById(id)
            if (data === null) {
                return response.status(404).json(notFound('No Subscription plan found'))
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
        @Body() subscriptionPlanDTO: SubscriptionPlanDTO
    ) {
        try {
            const data: any = await this.subscriptionPlanService.createSubscriptionPlan(subscriptionPlanDTO)
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
    async updateSubscriptionPlan(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number,
        @Body() subscriptionPlanDTO: SubscriptionPlanDTO
    ) {
        try {
            const data = await this.subscriptionPlanService.updateSubscriptionPlan(id, subscriptionPlanDTO);
            if (data?.status === 404) {
                return response.status(404).json(notFound(data?.message))
            }
            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error))
        }
    }

    @Delete('delete/:id')
    async deleteSubscriptionPlan(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number
    ) {
        try {
            const data: any = await this.subscriptionPlanService.deleteSubscriptionPlan(id)
            if (data?.status === 404) {
                return response.status(404).json(notFound('Subscription plan not found'))
            }
            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error))
        }
    }
}

