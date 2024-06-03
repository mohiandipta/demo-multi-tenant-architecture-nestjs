export class AuthDTO {
    readonly intUserId: number
    readonly strEmail: string
    readonly strPhone: string
    readonly strPassword: string
    readonly intOtp: number
    readonly strAccess_token: string
    readonly strRefresh_token: string
    readonly dteLastLogin: Date;
}

export class UserRegisterDTO {
    strUserName: string
    strFirstName: string
    strLastName: string
    strPhone: string
    strEmail: string
    strPassword: string
    intRoleId: number
    strImageURL: string
    intOrganizationId: number
}

export class shopRegisterDTO {
    strShopName: string
    strOwnerName: string
    strPhone: string
    strEmail: string
    strPassword: string
    strImageURL: string
    intOrganizationId: number
}

export class OrgRegisterDTO {
    strUserName: string
    strFirstName: string
    strLastName: string
    strPhone: string
    strEmail: string
    strPassword: string
    intRoleId: number
    strImageURL: string
    regOrg: RegOrganizationDTO
}

export class RegOrganizationDTO {
    readonly strOrganizationName: string
    readonly strOrganizationCode: string
    readonly strDescription: string
    readonly strIndustryType: string
    readonly strWebsite: string
    readonly intServiceId: number
    readonly dteCreatedAt: Date
    readonly dteUpdatedAt: Date
    readonly intCreatedBy: number
    readonly blnIsActive: boolean
}

