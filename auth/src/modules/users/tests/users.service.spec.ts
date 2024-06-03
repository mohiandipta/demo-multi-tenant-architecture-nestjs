import { Test, TestingModule } from '@nestjs/testing';
import { UserInfoService } from '../services/userInfo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserInfo } from '../entities/userInfo.entity';

describe('UsersService', () => {
  let service: UserInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInfoService, { provide: getRepositoryToken(UserInfo), useValue: jest.fn() }],
    }).compile();

    service = module.get<UserInfoService>(UserInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
