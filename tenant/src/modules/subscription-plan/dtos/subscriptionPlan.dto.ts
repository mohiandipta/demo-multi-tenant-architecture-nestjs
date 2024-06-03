export class SubscriptionPlanDTO {
    readonly strPlanName: string
    readonly strDescription: string
    readonly decPrice: number
    readonly strBillingCycle: string
    readonly intMaxUsers: number
    readonly intMaxApiRequestPerMin: number
    readonly strFeatures: string
    readonly blnEmailSupport: boolean
    readonly blnPhoneSupport: boolean
    readonly blnCustomerBranding: boolean
    readonly blnPriorityUpdates: boolean
    readonly dteCreatedAt: Date
    readonly dteUpdatedAt: Date
    readonly intUpdatedBy: number
    readonly isActive: boolean
}
