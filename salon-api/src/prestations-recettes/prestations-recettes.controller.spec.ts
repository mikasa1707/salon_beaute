import { Test, TestingModule } from '@nestjs/testing';
import { PrestationsRecettesController } from './prestations-recettes.controller';
import { PrestationsRecettesService } from './prestations-recettes.service';

describe('PrestationsRecettesController', () => {
  let controller: PrestationsRecettesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestationsRecettesController],
      providers: [PrestationsRecettesService],
    }).compile();

    controller = module.get<PrestationsRecettesController>(PrestationsRecettesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
