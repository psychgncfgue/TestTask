import { Controller, Post, Get, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './order.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  createOrder(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('productIds') productIds?: number[],
  ) {
    return this.ordersService.createOrder(title, description, productIds);
  }

  @Post(':orderId/products')
  addProducts(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body('productIds') productIds: number[],
  ) {
    return this.ordersService.addProductsToOrder(orderId, productIds);
  }

  @Get()
  getAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.ordersService.getAllOrders(page, limit);
  }

  @Delete(':orderId/products/:productId')
  removeProduct(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.ordersService.removeProductFromOrder(orderId, productId);
  }

  @Delete(':orderId')
  deleteOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.ordersService.deleteOrder(orderId);
  }

  @Get(':orderId')
  getOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Query('type') type = 'all',
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.ordersService.getOrderWithProducts(orderId, type, page, limit);
  }
}