import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './controllers/subscription.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Subscription
        ]),
    ],
    controllers: [
        SubscriptionController
    ],
    providers: [
        SubscriptionService
    ]
})

export class SubscriptionModule { }
