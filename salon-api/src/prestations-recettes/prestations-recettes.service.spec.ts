import { Test, TestingModule } from '@nestjs/testing';
import { PrestationsRecettesService } from './prestations-recettes.service';

describe('PrestationsRecettesService', () => {
  let service: PrestationsRecettesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrestationsRecettesService],
    }).compile();

    service = module.get<PrestationsRecettesService>(PrestationsRecettesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
