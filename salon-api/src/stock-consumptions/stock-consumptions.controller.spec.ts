import { Test, TestingModule } from '@nestjs/testing';
import { StockConsumptionsController } from './stock-consumptions.controller';
import { StockConsumptionsService } from './stock-consumptions.service';

describe('StockConsumptionsController', () => {
  let controller: StockConsumptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockConsumptionsController],
      providers: [StockConsumptionsService],
    }).compile();

    controller = module.get<StockConsumptionsController>(StockConsumptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
