import { Test, TestingModule } from '@nestjs/testing';
import { ProduitUniteService } from './produit-unite.service';

describe('ProduitUniteService', () => {
  let service: ProduitUniteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProduitUniteService],
    }).compile();

    service = module.get<ProduitUniteService>(ProduitUniteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
