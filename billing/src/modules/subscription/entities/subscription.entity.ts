import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('tblSubscription')
export class Subscription {
    @PrimaryGeneratedColumn()
    intId: number

    @Column({ type: 'int', width: 50, nullable: true })
    intSubscriptionPlanId: number;

    @Column({ type: 'int', width: 50, nullable: true })
    intOrgId: number;

    @Column({ type: 'datetime' })
    dteStartDate: Date

    @Column({ type: 'datetime' })
    dteEndDate: Date

    @Column({ type: 'boolean', default: true })
    isActive: boolean
}  
