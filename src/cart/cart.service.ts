import { Injectable } from '@nestjs/common';
import { CartItem, CartResponse } from './dto/cart.dto';

@Injectable()
export class CartService {

    async calculate(cartItems:CartItem[]): Promise<CartResponse> {

        return {
            subtotal: 0,
            discountsApplied: 0,
            totalAfterDiscounts: 0,
            vatAmount: 0,
            totalPayable: 0,
        };
    }
}
