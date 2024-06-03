export class CreateSubCategoryDto {
    readonly intCategoryId: number
    readonly strSubCategoryName: string
    readonly strDescription: string
    readonly strImageURL: string
    readonly intCreatedBy: number
    readonly dteCreatedAt: Date
    readonly dteUpdatedAt: Date
    readonly isActive: boolean
}
