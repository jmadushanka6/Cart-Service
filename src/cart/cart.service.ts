import { Injectable } from '@nestjs/common';
import { CartItem, CartRequest, CartResponse } from './dto/cart.dto';
import { CartEngineService } from './cart.engine/cart.engine.service';

@Injectable()
export class CartService {

    constructor(private readonly CartEngine: CartEngineService) {}

    async calculate(cartItems:CartRequest): Promise<CartResponse> {

        return this.CartEngine.calculateCart(cartItems);
    }
}
