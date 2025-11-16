import { Injectable, OnModuleInit } from '@nestjs/common';
import { RuleLoader } from './rule.loader';
import { RuleRegistry } from './rule.registry';
import { CartRequest, CartResponse } from '../dto/cart.dto';
import { EngineContext } from '../dto/engine.dto';

@Injectable()
export class CartEngineService {
    constructor(private ruleLoader: RuleLoader, private ruleRegistry: RuleRegistry) {

    }

    async calculateCart(cart: CartRequest): Promise<any> {

        const subtotal: number = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

        let context: EngineContext = {
            items: cart.items,
            subtotal,
            totalDiscount: 0,
            totalAfterDiscounts: subtotal,
            vatAmount: 0,
            totalPayable: subtotal,
        };
        const rules = this.ruleLoader.getRules();
        for (const rule of rules) {
            const handler = this.ruleRegistry.getRule(rule.type);
            if (!handler) {
                continue;
                //throw new NotAcceptableException(`rule handler not found for type ${rule.type}`);
            }
            context = handler.apply(context, rule.params); 
        }  

        return ({
            discountsApplied: context.totalDiscount,
            totalAfterDiscounts: context.totalAfterDiscounts,
            vatAmount: context.vatAmount,
            totalPayable: context.totalPayable,
        });
    }

}

