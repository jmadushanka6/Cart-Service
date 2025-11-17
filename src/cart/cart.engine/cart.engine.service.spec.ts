import { Test, TestingModule } from '@nestjs/testing';
import { CartEngineService } from './cart.engine.service';
import { RuleLoader } from './rule.loader';
import { RuleRegistry } from './rule.registry';
import { ConditionalDiscountRule } from '../rulebase/conditional-discount.rule';
import { BulkDiscountRule } from '../rulebase/bulk-discount.rule';
import { VatRule } from '../rulebase/vat.rule';

import { RuleDefinition } from "../dto/engine.dto";

describe('CartEngineService', () => {
  let service: CartEngineService;
  let registry: RuleRegistry;
  let loader: RuleLoader;

  const mockRuleLoader = {
    setRules: jest.fn(),
    getRules: jest.fn(),
  };

  beforeEach(async () => {

    // Initialize the RuleRegistry and register rules
    registry = new RuleRegistry();
    registry.registerRule(new ConditionalDiscountRule(registry));
    registry.registerRule(new BulkDiscountRule(registry));
    registry.registerRule(new VatRule(registry));

    // Override the ruleLoader with the mock
    loader = new RuleLoader(null);;
    loader.setRules = mockRuleLoader.setRules;
    loader.getRules = mockRuleLoader.getRules;

    service = new CartEngineService(loader, registry);
  });

  // test rules registration
let hybridRules: RuleDefinition[] = [
  {
      id: "A",
      type: "conditional_discount",
      priority: 0,
      params: {
          conditions: [
              {
                  field: "category",
                  operator: "EQUALS",
                  value: "electronics"
              }
          ],
          action: {
              discountPercent: 5
          }
      },
      active: true
  },
  {
      id: "B",
      type: "bulk_discount",
      priority: 101,
      params: {
          minPrice: 50,
          discountAmount: 10
      },
      active: true
  },
  {
      id: "C",
      type: "vat",
      priority: 1001,
      params: {
          discountPercent: 20
      },
      active: true
  }
];

  it('cart engine should be defined correclty', () => {
    expect(service).toBeDefined();
  });

  it('handles empty cart', async () => {
    mockRuleLoader.getRules.mockReturnValue(hybridRules);

    const result = await service.calculateCart({ items: [] });

    expect(result.subtotal).toBe(0);
    expect(result.discountsApplied).toBe(0); 
    expect(result.vatAmount).toBe(0);
    expect(result.totalPayable).toBe(0);
  });

  it('applies rules in order and calculate correct values', async () => {
    mockRuleLoader.getRules.mockReturnValue(hybridRules);

    const result = await service.calculateCart({
      items: [
        { name: 'LAPTOP', price: 1000, category: 'electronics', quantity: 1 },
        { name: 'BOOK', price: 20, category: 'books', quantity: 1 },
      ],
    });

    expect(result.subtotal).toBe(1020);
    expect(result.discountsApplied).toBe(60); // 60 (5% of 1000) + 10 
    expect(result.vatAmount).toBeCloseTo(192); // 20% of (1020 - 60)
    expect(result.totalPayable).toBeCloseTo(1152); // 1020 - 60 + 192
  });

  it('trigger bulk discount', async () => {
    mockRuleLoader.getRules.mockReturnValue(hybridRules);

    const result = await service.calculateCart({
      items: [
        { name: 'LAPTOP', price: 1000, category: 'electronics', quantity: 10 },
        { name: 'BOOK', price: 200, category: 'books', quantity: 1 },
      ],
    });

    expect(result.subtotal).toBe(10200);
    expect(result.discountsApplied).toBe(510); // 51 (5% of 10000) + 10 
    expect(result.vatAmount).toBeCloseTo(1938); // 20% of (10200 - 510)
    expect(result.totalPayable).toBeCloseTo(11628); // 10200 - 510 + 2190
  });

  it('skips bulk discount when total <= 50', async () => {
    mockRuleLoader.getRules.mockReturnValue(hybridRules);

    const result = await service.calculateCart({
      items: [
        { name: 'BOOK', price: 15, category: 'books', quantity: 1 },
        { name: 'COFFEE', price: 10, category: 'groceries', quantity: 1 },
      ],
    });

    expect(result.subtotal).toBe(25);
    expect(result.discountsApplied).toBe(0);
    expect(result.totalAfterDiscounts).toBeCloseTo(25);
    expect(result.vatAmount).toBeCloseTo(5);
    expect(result.totalPayable).toBeCloseTo(30);
  });


});
