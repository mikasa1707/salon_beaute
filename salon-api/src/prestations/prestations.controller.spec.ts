import { Test, TestingModule } from '@nestjs/testing';
import { PrestationsController } from './prestations.controller';
import { PrestationsService } from './prestations.service';

describe('PrestationsController', () => {
  let controller: PrestationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestationsController],
      providers: [PrestationsService],
    }).compile();

    controller = module.get<PrestationsController>(PrestationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
