import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartEngineService } from './cart.engine/cart.engine.service';
import { RuleLoader } from './cart.engine/rule.loader';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RuleRegistry } from './cart.engine/rule.registry';
import { ConditionalDiscountRule } from './rulebase/conditional-discount.rule';
import { BulkDiscountRule } from './rulebase/bulk-discount.rule';

@Module({
  imports: [ConfigModule],
  providers: [CartService, CartEngineService, RuleLoader,RuleRegistry, ConditionalDiscountRule, BulkDiscountRule, ConfigService],
  controllers: [CartController]
})
export class CartModule {}
