import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Media } from "../entities/media.entity";
import { MediaDTO } from "../dtos/media.dto";
import { privateDecrypt } from "crypto";
import { StorageService } from "src/utils/azure/storage.service";

@Injectable()
export class MediaService {
    constructor(
        @InjectRepository(Media)
        private mediaRepository: Repository<Media>,
        private azureStorageService: StorageService
    ) { }

    async findAll() {
        try {
            const mediaInfo = await this.mediaRepository.find()
            if (mediaInfo.length === 0) throw new NotFoundException('MediaFile not found');

            return {
                statusCode: 200,
                data: mediaInfo
            }
        } catch (error) {
            throw error
        }
    }

    async findByFileName(strFilename: string) {
        try {
            const mediaInfo = await this.mediaRepository.findOneBy({ strFilename });
            if (!mediaInfo) throw new NotFoundException('MediaFile can not be found by this id!');

            return mediaInfo
        } catch (error) {
            throw error
        }
    }

    async findById(uuid: string) {
        try {
            const mediaInfo = await this.mediaRepository.findOneBy({ uuid });
            if (!mediaInfo) throw new NotFoundException('MediaFile can not be found by this id!');

            return mediaInfo
        } catch (error) {
            throw error
        }
    }

    async create(file: any, intCreatedBy: number) {
        try {

            let fileLink = '';

            // Check if a file was provided
            if (!file) {
                throw new BadRequestException('No file provided');
            }


            const containerName = process.env.AZURE_CONTAINER_NAME_MEDIA;
            const fileName = `${Date.now()}_${file.originalname}`;
            const fileContent = await file.buffer;

            // Upload the file to Azure Storage
            fileLink = await this.azureStorageService.uploadImage(containerName, fileName, fileContent);

            // Create MediaDTO with necessary data
            const mediaData: MediaDTO = {
                strFiletype: file.originalname.split('.').pop(),
                dteCreatedAt: new Date(),
                isActive: true,
                intCreatedBy: intCreatedBy,
                strFileurl: fileLink,
                strFilename: file.originalname
            };
            // Save the media data to the database
            const mediaInfo = await this.mediaRepository.save(mediaData);

            if (!mediaInfo) {
                throw new NotFoundException('MediaFile cannot be created. Please try again');
            }

            // console.log(mediaInfo);
            return mediaInfo;
        } catch (error) {
            return error.response
        }
    }

    async update(uuid: string, mediaDTO: MediaDTO) {
        try {
            const mediaInfo = await this.mediaRepository.findOneBy({ uuid });
            if (!mediaInfo) throw new NotFoundException('MediaFile not found');

            const info = await this.mediaRepository.update(uuid, mediaDTO)
            if (!info) throw new NotFoundException('MediaFile can not be updated. Please try again');

            return info
        } catch (error) {
            return error.response
        }
    }

    async delete(uuid: string) {
        try {
            const mediaInfo = await this.mediaRepository.findOneBy({ uuid });
            if (!mediaInfo) throw new NotFoundException('MediaFile not found');

            const info = await this.mediaRepository.delete(uuid);
            if (!info) throw new NotFoundException('MediaFile can not be deleted. Please try again');

            return {
                statusCode: 200,
                data: info
            };
        }
        catch (error) {
            return error.response
        }
    }

    async deleteByUUID(uuid: string) {
        try {
            const mediaInfo = await this.mediaRepository.findOneBy({ uuid: uuid });
            if (!mediaInfo) throw new NotFoundException('MediaFile not found');

            const info = await this.mediaRepository.delete({ uuid: uuid });
            if (!info) throw new NotFoundException('MediaFile can not be deleted. Please try again');

            return {
                statusCode: 200,
                message: "Media successfully deleted!"
            };
        }
        catch (error) {
            return error.response
        }
    }
}
