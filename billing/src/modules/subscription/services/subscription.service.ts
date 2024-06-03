import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "../entities/subscription.entity";
import { SubscriptionDTO } from "../dtos/subscription.dto";

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>
    ) { }

    async findAll() {
        try {
            const subscriptionInfo = await this.subscriptionRepository.find({ where: { isActive: true } })
            return subscriptionInfo
        } catch (error) {
            return { Status: 500, message: error.message, error: 'Internal Server Error' };
        }
    }

    async findById(intId: number) {
        try {
            const subscriptionInfo = await this.subscriptionRepository.findOneBy({ intId })
            return subscriptionInfo
        } catch (error) {
            return { Status: 500, message: error.message, error: 'Internal Server Error' };
        }
    }

    async createSubscription(subscriptionDTO: SubscriptionDTO) {
        try {
            const subscriptionInfo = await this.subscriptionRepository.save(subscriptionDTO)
            return subscriptionInfo
        } catch (error) {
            return { Status: 500, message: error.message, error: 'Internal Server Error' };
        }
    }

    async updateSubscription(intId: number, subscriptionDTO: SubscriptionDTO) {
        try {
            const subscriptionInfo = await this.subscriptionRepository.findOneBy({ intId });
            if (!subscriptionInfo) throw new NotFoundException('Subscription does not exist');

            const info = await this.subscriptionRepository.update(intId, subscriptionDTO)
            return info;
        } catch (error) {
            return error
        }
    }

    async deleteSubscription(intId: number) {
        try {
            const info = await this.subscriptionRepository.findOneBy({ intId });
            if (!info) throw new NotFoundException('Subscription does not exist');

            const subscriptionInfo = await this.subscriptionRepository.update(intId, { isActive: false });
            return subscriptionInfo;
        } catch (error) {
            return error
        }
    }
}
