import { Test, TestingModule } from '@nestjs/testing';
import { ProduitUniteController } from './produit-unites.controller';
import { ProduitUniteService } from './produit-unites.service';

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
