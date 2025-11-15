import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartEngineService } from './cart.engine/cart.engine.service';

@Module({
  providers: [CartService, CartEngineService],
  controllers: [CartController]
})
export class CartModule {}
