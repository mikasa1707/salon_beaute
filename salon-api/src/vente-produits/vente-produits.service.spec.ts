import { Test, TestingModule } from '@nestjs/testing';
import { VenteProduitsService } from './vente-produits.service';

describe('VenteProduitsService', () => {
  let service: VenteProduitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VenteProduitsService],
    }).compile();

    service = module.get<VenteProduitsService>(VenteProduitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
