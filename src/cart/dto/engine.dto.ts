import { CartItem } from '../dto/cart.dto';

export interface EngineContext {
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  totalAfterDiscounts: number;
  vatAmount: number;
  totalPayable: number;
}

export interface RuleDefinition {
  id: string;
  type: string;
  params?: Record<string, any>;
  priority: number | 0;
  active: boolean;
}