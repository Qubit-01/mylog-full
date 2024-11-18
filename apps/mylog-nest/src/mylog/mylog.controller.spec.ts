import { Test, TestingModule } from '@nestjs/testing';
import { MylogController } from './mylog.controller';
import { MylogService } from './mylog.service';

describe('MylogController', () => {
  let controller: MylogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MylogController],
      providers: [MylogService],
    }).compile();

    controller = module.get<MylogController>(MylogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
