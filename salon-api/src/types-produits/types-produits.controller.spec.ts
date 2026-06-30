import { Test, TestingModule } from '@nestjs/testing';
import { TypesProduitsController } from './types-produits.controller';
import { TypesProduitsService } from './types-produits.service';

describe('TypesProduitsController', () => {
  let controller: TypesProduitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypesProduitsController],
      providers: [TypesProduitsService],
    }).compile();

    controller = module.get<TypesProduitsController>(TypesProduitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
