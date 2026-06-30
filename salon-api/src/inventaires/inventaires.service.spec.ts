import { Test, TestingModule } from '@nestjs/testing';
import { InventairesService } from './inventaires.service';

describe('InventairesService', () => {
  let service: InventairesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventairesService],
    }).compile();

    service = module.get<InventairesService>(InventairesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
