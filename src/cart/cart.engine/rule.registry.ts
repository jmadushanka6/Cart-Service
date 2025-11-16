import { OnModuleInit } from "@nestjs/common";
import { BaseRule } from "../rulebase/base.rule";

export class RuleRegistry {

    private readonly rules = new Map<string, BaseRule>();

    registerRule(rule: BaseRule): void {
        this.rules.set(rule.type, rule);
    }

    getRule(type: string): BaseRule {
        return this.rules.get(type);
    }

}