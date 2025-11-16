# Description
# Rule Engine – Hybrid Chain of Responsibility (NestJS)

This project implements a hybrid rule engine using the Chain of Responsibility pattern to calculate shopping cart totals, discounts, and VAT.

The system supports both hard-coded rule handlers and dynamic rules loaded from a `rules.json` file. Rules execute in ascending order of priority and update a shared calculation context.

This MVP assumes quantity is always an integer and does not validate item names or categories.

---

## Features

### Hybrid Rule Engine
Supports a mix of:
- Hard-coded handlers (bulk discount, VAT, etc.)
- Dynamic conditional rules defined in JSON

### Rules Loaded Once at Startup
Rules are loaded during application initialization and cached in memory for all requests.

### Chain of Responsibility
Rules run sequentially by priority. Each rule mutates an `EngineContext` and passes it to the next rule.

### SOLID Architecture
- SRP: Each rule does exactly one thing  
- OCP: New rules can be added without modifying the engine  
- ISP: All rules implement the same interface  
- DIP: The engine depends only on abstractions  

---

## rules.json Structure

Example structure:

```json
{
  "rules": [
    {
      "id": "string",
      "type": "RULE_TYPE",
      "priority": 0,
      "active": true,
      "params": {
        "conditions": [
          {
            "field": "category" | "name" | "price",
            "operator": "EQUALS" | "GT" | "GTE" | "LT" | "LTE",
            "value": "string or number"
          }
        ],
        "action": {
          "discountPercent": 10
        }
      }
    }
  ]
}
```

Rule Types

conditional_discount | bulk_discount | vat


Priority Guide

0          → dynamic conditional rules
1–100      → item/category specific rules
101–1000   → group rules (bulk discount)
1001+      → tax rules (vat)


active

    true → rule executes
    false → rule is skipped



Environment Variables

RULES_FILE_PATH=<rules.json location>

How the Rule Engine Works
1. Rules Loaded Once

    RuleManagerService loads and caches rules at startup.

2. Rule Handlers Initialized at Startup

    All rule classes register themselves into the RuleRegistryService.

3. Chain of Responsibility Execution

    The engine:

    Reads the cached rules
    Retrieves the appropriate handler from the registry
    Executes rules in order
    Each rule updates the shared EngineContext

4. Hybrid Modle

    | Type      | Defined In       | Examples             |
    | --------- | ---------------- | -------------------- |
    | Hardcoded | TypeScript class | bulk_discount, vat   |
    | Dynamic   | rules.json       | conditional_discount |

5. Available Rule Handlers

    vat.rule – calculates VAT
    bulk-discount.rule – flat discount based on total
    conditional-discount.rule – flexible rule supporting category/name/price conditions



Future Enhancements

    Add name and category validation
    Full schema validation for rules.json
    Add OR logic and more complex rule combinations
    Implement richer rule types (tiered discounts)


Adding New Rules

    Conditional Discounts
        No code changes required.
        Simply add to rules.json.

    New Rule Types
        Create a new rule handler class
        Implement the PricingRule interface
        Register it at startup
        Add rule definition to rules.json

    Edge Cases Considered

Empty items list

        Missing or invalid rule parameters
        Negative price or quantity
        Quantity must be an integer
        Category/name must be strings
        Supports multiple atomic conditions (limited testing in MVP)
        Inactive rules are ignored
        Missing params handled safely
        (rules.json is not validated for MVP.)


## Installation

```bash
$ npm install
define rules.json
```


## Running The App

```bash
$ npm run start
$ npm run start:dev
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
