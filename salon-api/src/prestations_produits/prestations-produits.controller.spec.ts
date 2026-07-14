import { Test, TestingModule } from '@nestjs/testing';
import { PrestationsProduitsController } from './prestations-produits.controller';

describe('PrestationsProduitsController', () => {
  let controller: PrestationsProduitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestationsProduitsController],
    }).compile();

    controller = module.get<PrestationsProduitsController>(PrestationsProduitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
