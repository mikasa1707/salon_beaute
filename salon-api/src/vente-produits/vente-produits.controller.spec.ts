import { Test, TestingModule } from '@nestjs/testing';
import { VenteProduitsController } from './vente-produits.controller';

describe('VenteProduitsController', () => {
  let controller: VenteProduitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VenteProduitsController],
    }).compile();

    controller = module.get<VenteProduitsController>(VenteProduitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
