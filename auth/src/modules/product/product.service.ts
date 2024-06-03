import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) { }


  async create(productDto: ProductDto) {
    try {
      // const isExist = await this.productRepository.findOneBy({ strSlug: productDto.strSlug });
      const isExist = await this.checkIsExistProductBySlug(productDto.strSlug)
      if (isExist) return ('product already exist using this slug!');
      const productInfo = await this.productRepository.save(productDto)
      if (!productInfo) throw new NotFoundException('product can not be created. Please try again');
      return productInfo

    } catch (error) {
      console.log(error);
      throw error
    }
  }
  async checkIsExistProductBySlug(slug: string) {
    try {
      const isExist = await this.productRepository.findOneBy({ strSlug: slug });
      if (isExist) return true;
      else false
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async findAll() {
    try {
      const allProducts = await this.productRepository.find()
      if (allProducts.length === 0) throw new NotFoundException('No Products found');
      return allProducts
    } catch (error) {
      throw error
    }
  }

  async findAllActiveProducts() {
    try {
      const allProducts = await this.productRepository.find({ where: { isActive: true } })
      if (allProducts.length === 0) throw new NotFoundException('No Active Products found');
      return allProducts
    } catch (error) {
      throw error
    }
  }

  async findAllInActiveProduct() {
    try {
      const allProducts = await this.productRepository.find({ where: { isActive: false } })
      if (allProducts.length === 0) throw new NotFoundException('No Inactive Products found');
      return allProducts
    } catch (error) {
      throw error
    }
  }

  async findByProductSlug(slug: string) {
    try {
      const product = await this.productRepository.findOneBy({ strSlug: slug });
      if (!product) throw new NotFoundException('No Product found using this slug!');

      return product
    } catch (error) {
      throw error
    }
  }

  async findByFeaturedProduct() {
    try {
      const product = await this.productRepository.find({ where: { isFeatured: true } });
      if (!product) throw new NotFoundException('No Featured product available!');

      return product
    } catch (error) {
      throw error
    }
  }

  async findById(uuid: string) {
    try {
      const product = await this.productRepository.findOneBy({ strUuid: uuid });
      if (!product) throw new NotFoundException('No Product found!');

      return product
    } catch (error) {
      throw error
    }
  }

  async findByCategory(intCategory: number) {
    try {
      const productBycategory = await this.productRepository.findBy({ intCategoryId: intCategory });
      if (productBycategory.length === 0) throw new NotFoundException('No Product found for this category!');

      return productBycategory
    } catch (error) {
      throw error
    }
  }

  async findBySubCategory(intSubCategoryId: number) {
    try {
      const productBySubCategory = await this.productRepository.findBy({ intSubCategoryId: intSubCategoryId });
      if (productBySubCategory.length === 0) throw new NotFoundException('No Product found for this sub category!');

      return productBySubCategory
    } catch (error) {
      throw error
    }
  }

  async findByAdditionalCategory(intAdditionalCategoryId: number) {
    try {
      const productbyAdditionalCategory = await this.productRepository.findBy({ intAdditionalCategoryId: intAdditionalCategoryId });
      if (productbyAdditionalCategory.length === 0) throw new NotFoundException('No Product found for this additional category!');

      return productbyAdditionalCategory
    } catch (error) {
      throw error
    }
  }

  async update(uuid: string, productDto: ProductDto) {
    try {
      const productInfo = await this.productRepository.findOneBy({ strUuid: uuid });
      if (!productInfo) throw new NotFoundException('Product not found');

      // Update the product entity with the new data from productDto
      const updatedProduct = Object.assign(productInfo, productDto);

      // Save the updated entity
      const info = await this.productRepository.save(updatedProduct);
      if (!info) throw new NotFoundException('Product cannot be updated. Please try again');

      return info;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }

  }

  async updateStockStatus(uuid: string, status: boolean) {
    try {
      const productInfo = await this.productRepository.findOneBy({ strUuid: uuid });
      if (!productInfo) throw new NotFoundException('product not found');

      const info = await this.productRepository.update({ strUuid: uuid }, { isStock: status })
      console.log(info);

      if (!info) throw new NotFoundException('Product can not be updated. Please try again');

      return info
    } catch (error) {
      throw error
    }
  }

  async updateProductStatus(uuid: string, status: boolean) {
    try {
      const productInfo = await this.productRepository.findOneBy({ strUuid: uuid });
      if (!productInfo) throw new NotFoundException('product not found');
      console.log(uuid, status);

      const info = await this.productRepository.update({ strUuid: uuid }, { isActive: status })

      if (!info) throw new NotFoundException('Product can not be updated. Please try again');

      return info
    } catch (error) {
      throw error
    }
  }
}
