import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CartRequest, CartResponse } from './dto/cart.dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {

    constructor(private readonly cartService: CartService) {}

    @Post("calculate")
    @HttpCode(200)
    calculateCart(@Body() body: CartRequest): Promise<CartResponse> {
        return this.cartService.calculate(body);
    }

}
