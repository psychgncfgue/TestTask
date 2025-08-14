import { Controller, Get, Param, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ProductsService } from './product.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) { }

  @Get('prices-by-type')
  async getPricesByType() {
    console.log('HIT /products/prices-by-type');
    return this.productsService.getPricesByType();
  }

  @Get()
  async findAll(
    @Query('type') type: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    if (!type) {
      throw new BadRequestException('Type query parameter is required');
    }
    return this.productsService.findAll(type, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }
}