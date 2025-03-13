import { Test, TestingModule } from '@nestjs/testing';
import { StoreLocationController } from './store-location.controller';

describe('LocationController', () => {
  let controller: StoreLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreLocationController],
    }).compile();

    controller = module.get<StoreLocationController>(StoreLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
