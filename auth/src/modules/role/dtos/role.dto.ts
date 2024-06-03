export class RoleDTO {
    readonly strRoleName: any['super-admin' | 'admin' | 'user']
    readonly intCreatedBy: number
    readonly dteCreatedAt: string
    readonly isActive: boolean
}
