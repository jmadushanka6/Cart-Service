import { Type } from 'class-transformer';
import {
    IsArray, IsInt, IsNotEmpty, IsNumber,
    IsPositive, IsString, Min, ValidateNested, ArrayMinSize
} from 'class-validator';

export class CartItem {
    @IsString() @IsNotEmpty() name: string;
    @IsString() @IsNotEmpty() category: string;
    @IsNumber() @IsPositive() price: number;
    @IsInt() @Min(1) quantity: number;
}

export class CartRequest {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CartItem)
    items: CartItem[];
}

export interface CartResponse {
    subtotal: number;
    discountsApplied: number;
    totalAfterDiscounts: number;
    vatAmount: number;
    totalPayable: number;
}
