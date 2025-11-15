import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartEngineService } from './cart.engine/cart.engine.service';
import { RuleLoader } from './cart.engine/rule.loader';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RuleRegistry } from './cart.engine/rule.registry';

@Module({
  imports: [ConfigModule],
  providers: [CartService, CartEngineService, RuleLoader,RuleRegistry, ConfigService],
  controllers: [CartController]
})
export class CartModule {}
