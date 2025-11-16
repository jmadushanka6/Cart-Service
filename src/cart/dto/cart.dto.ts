import { Expose, Transform, Type } from 'class-transformer';
import {
    IsArray, IsInt, IsNotEmpty, IsNumber,
    IsPositive, IsString, Min, ValidateNested, ArrayMinSize
} from 'class-validator';
import Decimal from 'decimal.js';

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

export class CartResponse {
    @Transform(({ value }) => Number(new Decimal(value).toFixed(2)))
    subtotal: number;

    @Transform(({ value }) => Number(new Decimal(value).toFixed(2)))
    discountsApplied: number;

    @Transform(({ value }) => Number(new Decimal(value).toFixed(2)))
    totalAfterDiscounts: number;

    @Transform(({ value }) => Number(new Decimal(value).toFixed(2)))
    vatAmount: number;

    @Transform(({ value }) => Number(new Decimal(value).toFixed(2)))
    totalPayable: number;
}
