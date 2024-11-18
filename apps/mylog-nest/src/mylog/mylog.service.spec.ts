import { Test, TestingModule } from '@nestjs/testing';
import { MylogService } from './mylog.service';

describe('MylogService', () => {
  let service: MylogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MylogService],
    }).compile();

    service = module.get<MylogService>(MylogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
