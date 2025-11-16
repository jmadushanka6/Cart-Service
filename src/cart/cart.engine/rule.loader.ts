import { Injectable, OnModuleInit } from "@nestjs/common";
import { RuleDefinition } from "../dto/engine.dto";
import { ConfigService } from '@nestjs/config';

import * as path from "path";
import * as fs from 'fs';

@Injectable()
export class RuleLoader implements OnModuleInit {

    private ruleDefenitions: RuleDefinition[] = [];

    constructor(private config: ConfigService) {
        
    }

    async onModuleInit() {
        this.ruleDefenitions = await this.setRules();
    }

    getRules(): RuleDefinition[] {
        return this.ruleDefenitions;
    }

    async setRules() {
        const rules = await this.loadRulesFromResource();
        return this.filterAndSortRules(rules);
    }

    private async loadRulesFromResource(): Promise<RuleDefinition[]> {

        // based on your resource, implement the logic to load rules
        // for MVP, we are using hardcoded JSON file
 
        const RULES_FILE_PATH = this.config.getOrThrow<string>('RULES_FILE_PATH');
        const filePath: string = path.join(RULES_FILE_PATH);
        const raw = await fs.promises.readFile(filePath, 'utf8'); 
        const jsonParsedRules = JSON.parse(raw);

        if (!Array.isArray(jsonParsedRules)) {
            throw new Error('Invalid rules format in resource');
        }

        let ruleDefenitions: RuleDefinition[] = [];
        for (const r of jsonParsedRules) {
            if (!r.type || r.priority === undefined || r.active === undefined) {
                throw new Error(`Missing required fields in rule: ${JSON.stringify(r)}`);
            }

            const def: RuleDefinition = {
                id: r.id,
                type: r.type,
                priority: r.priority,
                active: r.active,
                params: r.params || {},
            };
            ruleDefenitions.push(def);
        }

        return ruleDefenitions;
    }

    private async filterAndSortRules(rules: RuleDefinition[]): Promise<RuleDefinition[]> {
        // filter active rules and sort descending by priority
        rules = rules.filter(r => r.active).sort((a, b) => a.priority - b.priority);
        return rules;
    }

}
