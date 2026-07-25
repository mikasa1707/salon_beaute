import { Test, TestingModule } from '@nestjs/testing';
import { UnitesMesureController } from './unite-mesure.controller';
import { UnitesMesureService } from './unite-mesure.service';

describe('UnitesMesureController', () => {
  let controller: UnitesMesureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitesMesureController],
      providers: [UnitesMesureService],
    }).compile();

    controller = module.get<UnitesMesureController>(UnitesMesureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
