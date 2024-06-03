import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from './create-sub-category.dto';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {
    readonly intCategoryId: number
    readonly strSubCatgoryName: string
    readonly strDescription: string
    readonly strImageURL: string
    readonly intCreatedBy: number
    readonly dteCreatedAt: Date
    readonly dteUpdatedAt: Date
    readonly isActive: boolean
}
