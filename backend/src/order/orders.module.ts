import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Product } from '../product/product.entity';
import { ProductsService } from '../product/product.service';
import { OrdersService } from './order.service';
import { OrdersController } from './order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product])],
  providers: [OrdersService, ProductsService],
  controllers: [OrdersController],
})
export class OrderModule {}