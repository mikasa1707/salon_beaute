import { Test, TestingModule } from '@nestjs/testing';
import { FacturationsController } from './facturations.controller';

describe('FacturationsController', () => {
  let controller: FacturationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturationsController],
    }).compile();

    controller = module.get<FacturationsController>(FacturationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
