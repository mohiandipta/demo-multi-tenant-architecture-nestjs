
export class ProductDto {
    readonly intCategoryId: number
    readonly intSubCategoryId: number
    readonly intAdditionalCategoryId: number
    readonly uuid: string
    readonly strItem: string
    readonly strSlug: string
    readonly strDesccription: string
    readonly intUnitId: number
    readonly strUnit: string
    readonly strPackSize: string
    readonly intUOM: number
    readonly decCostPrice: number
    readonly decMrpPrice: number
    readonly decOfferPrice: number
    readonly decPrePaidAmount: number
    readonly isFeatured: boolean
    readonly isStock: boolean
    readonly isCan: boolean
    readonly strThumbnailUuid: string
    readonly strThumbnailUrl: string
    readonly strHighQUuid: string
    readonly strHighQUrl: string
    readonly strLowQUuid: string
    readonly strLowQUrl: string
    readonly strIconUuid: string
    readonly strIconUrl: string
    readonly intLastActionBy: number
    readonly dteCreatedAt: Date
    readonly dteUpdatedAt: Date
    readonly isActive: boolean
}
