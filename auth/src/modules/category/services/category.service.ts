import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { privateDecrypt } from 'crypto';
import { Repository } from 'typeorm';
import { Media } from 'src/modules/media/entities/media.entity';
import { MediaService } from 'src/modules/media/services/media.service';
import { SubCategoryService } from '../sub-category/services/sub-category.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly subCategoryService: SubCategoryService
  ) {}

  async findAll() {
    try {
      const categoryInfo = await this.categoryRepository.find();
      if (categoryInfo.length === 0)
        throw new NotFoundException('No category found');
      return categoryInfo;
    } catch (error) {
      throw error;
    }
  }

  async getAllCategoryBySubcategory() {
    try {
      const categoryInfo = await this.categoryRepository.find()
      const subCategoryInfo = await this.subCategoryService.findAll()

      const response = categoryInfo.map(category => {
        const subcategories = subCategoryInfo.filter(subcategory => subcategory.intCategoryId === category.intId)
          .map(subcategory => ({
            subCategoryId: subcategory.intId,
            subCatgoryName: subcategory.strSubCategoryName,
            subCatgoryIcon: subcategory.strImageURL
          }));

        return {
          categoryId: category.intId,
          categoryName: category.strCategoryName,
          categoryIcon: category.strImageURL,
          subCategory: subcategories
        };
      });

      if (response.length === 0)
        throw new NotFoundException('No subCategory and category found');
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const categoryInfo = await this.categoryRepository.findOneBy({ intId: id });
      if (!categoryInfo) throw new NotFoundException('category not found');
      return categoryInfo;
    } catch (error) {
      throw error;
    }
  }

  async create(categoryDTO: CreateCategoryDto) {
    // if (!categoryDTO[0].strCategoryName) {
    //   throw new BadRequestException('Category name are required');
    // }

    try {
      const categoryInfo = await this.categoryRepository.save(categoryDTO);
      if (!categoryInfo)
        throw new InternalServerErrorException('Could not create category');
      return categoryInfo;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ intId: id });
    if (!category) throw new NotFoundException('Category not found');

    try {
      updateCategoryDto = {
        ...updateCategoryDto,
        dteUpdatedAt: new Date(),
      };
      const categoryInfo = await this.categoryRepository.save({
        ...category,
        ...updateCategoryDto,
      });
      if (!categoryInfo)
        throw new InternalServerErrorException('Could not update category');
      return categoryInfo;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({ intId: id });
    if (!category) throw new NotFoundException('Branch not found');

    try {
      const categoryInfo = await this.categoryRepository.delete({ intId: id });
      if (!categoryInfo)
        throw new InternalServerErrorException('Could not delete branch');
      return categoryInfo;
    } catch (error) {
      throw error;
    }
  }
}
