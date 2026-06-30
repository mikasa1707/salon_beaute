import { Test, TestingModule } from '@nestjs/testing';
import { InventairesController } from './inventaires.controller';
import { InventairesService } from './inventaires.service';

describe('InventairesController', () => {
  let controller: InventairesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventairesController],
      providers: [InventairesService],
    }).compile();

    controller = module.get<InventairesController>(InventairesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
