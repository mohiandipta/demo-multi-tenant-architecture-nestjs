import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoryController } from '../controllers/sub-category.controller';
import { SubCategoryService } from '../services/sub-category.service';

describe('SubCategoryController', () => {
  let controller: SubCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCategoryController],
      providers: [SubCategoryService],
    }).compile();

    controller = module.get<SubCategoryController>(SubCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
