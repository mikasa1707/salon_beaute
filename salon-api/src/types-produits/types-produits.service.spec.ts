import { Test, TestingModule } from '@nestjs/testing';
import { TypesProduitsService } from './types-produits.service';

describe('TypesProduitsService', () => {
  let service: TypesProduitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypesProduitsService],
    }).compile();

    service = module.get<TypesProduitsService>(TypesProduitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
