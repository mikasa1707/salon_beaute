import { Test, TestingModule } from '@nestjs/testing';
import { UnitesMesureController } from './unites-mesure.controller';
import { UnitesMesureService } from './unites-mesure.service';

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
