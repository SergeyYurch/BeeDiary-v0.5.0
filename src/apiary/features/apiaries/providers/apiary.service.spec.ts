import { Test, TestingModule } from '@nestjs/testing';
import { ApiaryService } from './apiary.service';

describe('ApiaryService', () => {
  let service: ApiaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiaryService],
    }).compile();

    service = module.get<ApiaryService>(ApiaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
