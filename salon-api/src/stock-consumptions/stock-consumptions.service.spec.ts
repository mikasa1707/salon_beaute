import { Test, TestingModule } from '@nestjs/testing';
import { StockConsumptionsService } from './stock-consumptions.service';

describe('StockConsumptionsService', () => {
  let service: StockConsumptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockConsumptionsService],
    }).compile();

    service = module.get<StockConsumptionsService>(StockConsumptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
