import { Injectable, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { EngineContext } from '../dto/engine.dto';
import { BaseRule } from './base.rule';
import { RuleRegistry } from '../cart.engine/rule.registry';

interface Condition {
    field: 'category' | 'name' | 'price';
    operator: 'EQUALS' | 'GT' | 'GTE' | 'LT' | 'LTE';
    value: string | number;
}

@Injectable()
export class ConditionalDiscountRule implements BaseRule, OnModuleInit {
    type = 'conditional_discount';

    constructor(private readonly registry: RuleRegistry) {

    }

    onModuleInit() { 
        console.log(`Registering rule handler for type: ${this.type}`); 
        this.registry.registerRule(this); 
    }

    private matches(item: any, cond: Condition): boolean {
        const val = item[cond.field];
        switch (cond.operator) {
            case 'EQUALS': return val === cond.value;
            case 'GT': return val > cond.value;
            case 'GTE': return val >= cond.value;
            case 'LT': return val < cond.value;
            case 'LTE': return val <= cond.value;
            default: {
                // TODO: send a warning to Admin
                console.error(`No valid discount conditions in rule engine for the type: ${this.type}`);
                throw new ServiceUnavailableException('Service temporarily unavailable, please try later');
            }; 
        }
    }

    apply(ctx: EngineContext, params?: Record<string, any>): EngineContext {
        const conditions: Condition[] = params?.conditions ?? [];
        if (conditions.length === 0) {
            // TODO: send a warning to Admin
            console.error(`No valid discount conditions in rule engine for the type: ${this.type}`);
            throw new ServiceUnavailableException('Service temporarily unavailable, please try later');
        }

        const discountPercent = params?.action?.discountPercent ?? 0;
        const discountAmount = params?.action?.discountAmount ?? 0;

        let discount = 0;
        for (const item of ctx.items) {
            const ok = conditions.every(c => this.matches(item, c));
            if (ok) {
                if (discountPercent) {
                discount += item.price * item.quantity * (discountPercent / 100);
                } else if (discountAmount) {
                    discount += discountAmount;
                } else {
                    // TODO: send a warning to Admin
                    console.error(`No valid discount action found for the type: ${this.type}`);
                    throw new ServiceUnavailableException('Service temporarily unavailable, please try later');
                }
            }
        }
        ctx.totalDiscount += discount;
        ctx.totalAfterDiscounts = ctx.subtotal - ctx.totalDiscount;
        ctx.totalPayable = ctx.totalAfterDiscounts ;
        return ctx;
    }
}
