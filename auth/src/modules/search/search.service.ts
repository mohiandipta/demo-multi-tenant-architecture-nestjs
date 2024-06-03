import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from '../media/entities/media.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>
  ) {}

  async searchMedia (keyword: string) {
    try {
      return this.mediaRepository
      .createQueryBuilder('media')
        .where('media.strFilename LIKE :keyword', { keyword: `%${keyword}%` })
        .getMany();
    } catch (error) {
      throw error
    }
  }

  findAll() {
    return `This action returns all search`;
  }

  findOne(id: number) {
    return `This action returns a #${id} search`;
  }

  update(id: number, updateSearchDto: UpdateSearchDto) {
    return `This action updates a #${id} search`;
  }

  remove(id: number) {
    return `This action removes a #${id} search`;
  }
}
