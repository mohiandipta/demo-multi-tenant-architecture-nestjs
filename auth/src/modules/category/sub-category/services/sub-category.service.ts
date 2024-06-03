import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from '../dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from '../dto/update-sub-category.dto';
import { SubCategory } from '../entities/sub-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    @InjectRepository(Category)
    private readonly subCategoryRepository: Repository<SubCategory>
  ) { }

  async findAll() {
    try {
      const subcategoryInfo = await this.subCategoryRepository.find();
      if (subcategoryInfo.length === 0)
        throw new NotFoundException('No subCategory found');
      return subcategoryInfo;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const subcategoryInfo = await this.subCategoryRepository.findOneBy({ intId: id });
      if (!subcategoryInfo) throw new NotFoundException('subCategory not found');
      return subcategoryInfo;
    } catch (error) {
      throw error;
    }
  }

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    // if (!createSubCategoryDto[0].strSubCategoryName) {
    //   throw new BadRequestException('subCategory name are required');
    // }

    try {
      const subcategoryInfo = await this.subCategoryRepository.save(createSubCategoryDto);
      if (!subcategoryInfo)
        throw new InternalServerErrorException('Could not create subCategory');
      return subcategoryInfo;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryRepository.findOneBy({ intId: id });
    if (!subCategory) throw new NotFoundException('subCategory not found');

    try {
      updateSubCategoryDto = {
        ...updateSubCategoryDto,
        dteUpdatedAt: new Date(),
      };
      const subcategoryInfo = await this.subCategoryRepository.save({
        ...subCategory,
        ...updateSubCategoryDto,
      });
      if (!subcategoryInfo)
        throw new InternalServerErrorException('Could not update subCategory');
      return subcategoryInfo;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    const subcategoryInfo = await this.subCategoryRepository.findOneBy({ intId: id });
    if (!subcategoryInfo) throw new NotFoundException('subCategory not found');

    try {
      const subcategoryInfo = await this.subCategoryRepository.delete({ intId: id });
      if (!subcategoryInfo)
        throw new InternalServerErrorException('Could not delete subCategory');
      return subcategoryInfo;
    } catch (error) {
      throw error;
    }
  }
}
