import { Injectable, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { EngineContext } from '../dto/engine.dto';
import { BaseRule } from './base.rule';
import { RuleRegistry } from '../cart.engine/rule.registry';
import Decimal from 'decimal.js';

@Injectable()
export class BulkDiscountRule implements BaseRule, OnModuleInit {
    type = 'bulk_discount';

    constructor(private readonly registry: RuleRegistry) {

    }

    onModuleInit() { 
        console.log(`Registering rule handler for type: ${this.type}`); 
        this.registry.registerRule(this); 
    }



  apply(ctx: EngineContext, params: Record<string, any>): EngineContext {
    const minimumPrice: number = params?.minPrice ?? 0;
    const discountAmount: number = params?.discountAmount ?? 0;

    if (minimumPrice < 0 || discountAmount < 0) {
      console.warn(`bulk-discount skipped due to invalid parameters. minPrice: ${minimumPrice}, discountAmount: ${discountAmount}`);
      throw new ServiceUnavailableException('Service temporarily unavailable, please try later');
    }

    if (ctx.subtotal > minimumPrice) {
      // ctx.totalDiscount = ctx.totalDiscount + discountAmount;
      // ctx.totalAfterDiscounts = ctx.subtotal - ctx.totalDiscount; 

      ctx.totalDiscount = Number( Decimal(ctx.totalDiscount).plus(Decimal(discountAmount)) );
      ctx.totalAfterDiscounts = Number(Decimal(ctx.subtotal).minus(Decimal(ctx.totalDiscount)));

    }

    return ctx;
  }
}
