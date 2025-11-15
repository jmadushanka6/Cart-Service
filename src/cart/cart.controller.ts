import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CartRequest, CartResponse } from './dto/cart.dto';

@Controller('cart')
export class CartController {

    @Post("calculate")
    @HttpCode(200)
    calculateCart(@Body() body: CartRequest): Promise<CartResponse> {
        return { } as Promise<CartResponse>;
    }

}
