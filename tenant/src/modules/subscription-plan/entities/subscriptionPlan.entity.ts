import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('tblSubscriptionPlan')
export class SubscriptionPlan {
    @PrimaryGeneratedColumn()
    intId: number

    @Column({ type: 'varchar', width: 255 })
    strPlanName: string

    @Column({ type: 'varchar', width: 255 })
    strDescription: string

    @Column({ type: 'decimal' })
    decPrice: number;

    @Column({ type: 'varchar', width: 255 })
    strBillingCycle: string

    @Column({ type: 'int' })
    intMaxUsers: number;

    @Column({ type: 'int' })
    intMaxApiRequestPerMin: number;

    @Column({ type: 'varchar', width: 255 })
    strFeatures: string

    @Column({ type: 'boolean', default: true })
    blnEmailSupport: boolean

    @Column({ type: 'boolean', default: false })
    blnPhoneSupport: boolean

    @Column({ type: 'boolean', default: false })
    blnCustomerBranding: boolean

    @Column({ type: 'boolean', default: false })
    blnPriorityUpdates: boolean

    @Column({ type: 'datetime' })
    dteCreatedAt: Date

    @Column({ type: 'datetime' })
    dteUpdatedAt: Date

    @Column({ type: 'int' })
    intUpdatedBy: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean
}   
