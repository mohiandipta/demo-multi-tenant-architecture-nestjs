import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlan } from './entities/subscriptionPlan.entity';
import { SubscriptionPlanService } from './services/subscriptionPlan.service';
import { SubscriptionPlanController } from './controllers/subscriptionPlan.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SubscriptionPlan
        ])
    ],
    controllers: [
        SubscriptionPlanController
    ],
    providers: [
        SubscriptionPlanService
    ],
    exports: [
        SubscriptionPlanService
    ]
})

export class SubscriptionPlanModule { }
