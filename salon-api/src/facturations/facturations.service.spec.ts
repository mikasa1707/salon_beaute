import { Test, TestingModule } from '@nestjs/testing';
import { FacturationsService } from './facturations.service';

describe('FacturationsService', () => {
  let service: FacturationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacturationsService],
    }).compile();

    service = module.get<FacturationsService>(FacturationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
