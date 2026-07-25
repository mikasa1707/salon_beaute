import { Test, TestingModule } from '@nestjs/testing';
import { UnitesMesureService } from './unite-mesure.service';

describe('UnitesMesureService', () => {
  let service: UnitesMesureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitesMesureService],
    }).compile();

    service = module.get<UnitesMesureService>(UnitesMesureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
