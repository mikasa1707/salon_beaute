import { Test, TestingModule } from '@nestjs/testing';
import { PrestationsProduitsService } from './prestations_produits.service';

describe('PrestationsProduitsService', () => {
  let service: PrestationsProduitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrestationsProduitsService],
    }).compile();

    service = module.get<PrestationsProduitsService>(PrestationsProduitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
