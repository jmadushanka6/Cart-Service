
export class RuleRegistry {

    private readonly rules = new Map<string, any>();

    registerRule(rule: any) {
        this.rules.set(rule.type, rule);
    }

    getRules(type: string): any[] {
        return this.rules.get(type) || [];
    }

}