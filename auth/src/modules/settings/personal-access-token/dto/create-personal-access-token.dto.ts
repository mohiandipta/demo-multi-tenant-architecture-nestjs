export class CreatePersonalAccessTokenDto {
    readonly intOrgId: number
    readonly intLastActionBy: number
    readonly strExpireAt: string
    readonly dteTokenValidity: Date
    readonly strTokenName: string
    readonly strToken: string
    readonly strDescription: string
    readonly dteCreatedAt: Date
    readonly isActive: boolean
}
