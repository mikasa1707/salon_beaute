import { Test, TestingModule } from '@nestjs/testing';
import { ProduitUniteController } from './produit-unite.controller';
import { ProduitUniteService } from './produit-unite.service';

describe('ProduitUniteController', () => {
  let controller: ProduitUniteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProduitUniteController],
      providers: [ProduitUniteService],
    }).compile();

    controller = module.get<ProduitUniteController>(ProduitUniteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
