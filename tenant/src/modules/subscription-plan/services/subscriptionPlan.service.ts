import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { SubscriptionPlan } from "../entities/subscriptionPlan.entity";
import { SubscriptionPlanDTO } from "../dtos/subscriptionPlan.dto";

@Injectable()
export class SubscriptionPlanService {
    constructor(
        @InjectRepository(SubscriptionPlan)
        private subscriptionPlanRepository: Repository<SubscriptionPlan>
    ) { }

    async findAll() {
        const subscriptionPlanInfo = await this.subscriptionPlanRepository.findBy({ isActive: true })
        return subscriptionPlanInfo
    }

    async findById(intId: number) {
        const subscriptionPlanInfo = await this.subscriptionPlanRepository.findOneBy({ intId })
        return subscriptionPlanInfo
    }

    async createSubscriptionPlan(subscriptionPlanDTO: SubscriptionPlanDTO) {
        const subscriptionPlanInfo = await this.subscriptionPlanRepository.save(subscriptionPlanDTO)
        return { status: 200, data: subscriptionPlanInfo }
    }

    async updateSubscriptionPlan(intId: number, subscriptionPlanDTO: SubscriptionPlanDTO) {
        try {
            const subscriptionPlanInfo = await this.subscriptionPlanRepository.findOneBy({ intId });
            if (!subscriptionPlanInfo) throw new NotFoundException('Subscription plan does not exist');

            const info = await this.subscriptionPlanRepository.update(intId, subscriptionPlanDTO)
            return info;
        } catch (error) {
            return error
        }
    }

    async deleteSubscriptionPlan(intId: number) {
        try {
            const info = await this.subscriptionPlanRepository.findOneBy({ intId });
            if (!info) throw new NotFoundException('Subscription plan does not exist');

            const subscriptionPlanInfo = await this.subscriptionPlanRepository.update(intId, { isActive: false });
            return subscriptionPlanInfo;
        } catch (error) {
            return error
        }
    }
}
