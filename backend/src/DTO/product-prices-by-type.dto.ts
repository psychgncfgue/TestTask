import { Price } from "src/product/product.entity";


export class ProductPricesByTypeDto {
  type: string;
  prices: Price[];
}
