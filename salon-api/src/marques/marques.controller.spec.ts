import { Test, TestingModule } from '@nestjs/testing';
import { MarquesController } from './marques.controller';
import { MarquesService } from './marques.service';

describe('MarquesController', () => {
  let controller: MarquesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarquesController],
      providers: [MarquesService],
    }).compile();

    controller = module.get<MarquesController>(MarquesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
