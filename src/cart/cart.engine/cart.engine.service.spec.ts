import { Test, TestingModule } from '@nestjs/testing';
import { CartEngineService } from './cart.engine.service';

describe('CartEngineService', () => {
  let service: CartEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartEngineService],
    }).compile();

    service = module.get<CartEngineService>(CartEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
