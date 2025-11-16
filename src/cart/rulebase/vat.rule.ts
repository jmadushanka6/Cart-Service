import { Injectable, OnModuleInit } from "@nestjs/common";
import { EngineContext } from "../dto/engine.dto";
import { BaseRule } from "./base.rule";
import { RuleRegistry } from "../cart.engine/rule.registry";

@Injectable()
export class VatRule implements BaseRule, OnModuleInit {
    type = 'vat';
    constructor(private readonly registry: RuleRegistry) { 

    }

    onModuleInit() {
        console.log(`Registering rule handler for type: ${this.type}`); 
        this.registry.registerRule(this);
    }

    apply(ctx: EngineContext, params?: Record<string, any>): EngineContext {
        const discountPercent = params?.discountPercent ?? 0;

        ctx.vatAmount = ctx.totalAfterDiscounts * (discountPercent / 100);
        ctx.totalPayable = ctx.totalAfterDiscounts + ctx.vatAmount;
        return ctx;
    }
}
