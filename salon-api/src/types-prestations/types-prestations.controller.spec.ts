import { Test, TestingModule } from '@nestjs/testing';
import { TypesPrestationsController } from './types-prestations.controller';
import { TypesPrestationsService } from './types-prestations.service';

describe('TypesPrestationsController', () => {
  let controller: TypesPrestationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypesPrestationsController],
      providers: [TypesPrestationsService],
    }).compile();

    controller = module.get<TypesPrestationsController>(TypesPrestationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
