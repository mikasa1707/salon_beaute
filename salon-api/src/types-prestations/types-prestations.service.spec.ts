import { Test, TestingModule } from '@nestjs/testing';
import { TypesPrestationsService } from './types-prestations.service';

describe('TypesPrestationsService', () => {
  let service: TypesPrestationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypesPrestationsService],
    }).compile();

    service = module.get<TypesPrestationsService>(TypesPrestationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
