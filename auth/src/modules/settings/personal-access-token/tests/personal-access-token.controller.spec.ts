import { Test, TestingModule } from '@nestjs/testing';
import { PersonalAccessTokenController } from '../controllers/personal-access-token.controller';
import { PersonalAccessTokenService } from '../services/personal-access-token.service';

describe('PersonalAccessTokenController', () => {
  let controller: PersonalAccessTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonalAccessTokenController],
      providers: [PersonalAccessTokenService],
    }).compile();

    controller = module.get<PersonalAccessTokenController>(PersonalAccessTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
