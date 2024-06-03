import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonalAccessTokenDto } from './create-personal-access-token.dto';

export class UpdatePersonalAccessTokenDto extends PartialType(CreatePersonalAccessTokenDto) {
    readonly intLastActionBy: number
    readonly strExpireAt: string
    readonly dteTokenValidity: Date
    readonly strTokenName: string
    readonly strToken: string
    readonly strDescription: string
    readonly dteCreatedAt: Date
    readonly isActive: boolean
}
