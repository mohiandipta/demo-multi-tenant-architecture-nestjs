import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    readonly strCategoryName: string
    readonly strDescription: string
    readonly strImageURL: string
    readonly intCreatedBy: number
    readonly dteUpdatedAt: Date
    readonly isActive: boolean
}
