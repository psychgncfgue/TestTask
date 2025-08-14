import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async createOrder(title: string, description: string, productIds?: number[]) {
    let products: Product[] = [];

    if (productIds?.length) {
      products = await this.productsRepository.find({ where: { id: In(productIds) } });
      if (products.length !== productIds.length) {
        throw new BadRequestException('Some products not found');
      }
    }

    const order = this.ordersRepository.create({
      title,
      description,
      date: new Date().toISOString(),
      products,
    });

    return await this.ordersRepository.save(order);
  }

  async addProductsToOrder(orderId: number, productIds: number[]) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['products'],
    });
    if (!order) throw new NotFoundException('Order not found');

    const products = await this.productsRepository.find({ where: { id: In(productIds) } });
    if (!products.length) throw new BadRequestException('Products not found');

    order.products.push(...products);
    return await this.ordersRepository.save(order);
  }

  async getAllOrders(page = 1, limit = 10) {
    const [orders, total] = await this.ordersRepository.findAndCount({
      relations: ['products'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    const ordersWithSum = orders.map(order => {
      if (!order.products.length) return order;
      const totalUSD = order.products.reduce((sum, p) => {
        const usdPrice = p.price.find(pr => pr.symbol === 'USD');
        return sum + (usdPrice?.value || 0);
      }, 0);
      const totalUAH = order.products.reduce((sum, p) => {
        const uahPrice = p.price.find(pr => pr.symbol === 'UAH');
        return sum + (uahPrice?.value || 0);
      }, 0);
      return {
        ...order,
        totalUSD,
        totalUAH,
      };
    });
    console.log(total)
    return {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
      orders: ordersWithSum,
    };
  }

  async removeProductFromOrder(orderId: number, productId: number) {
    const product = await this.productsRepository.findOne({ where: { id: productId, orderId } });
    if (!product) throw new NotFoundException('Product not found in this order');

    product.order = null;
    product.orderId = null;
    return await this.productsRepository.save(product);
  }

  async deleteOrder(orderId: number) {
    const order = await this.ordersRepository.findOne({ where: { id: orderId }, relations: ['products'] });
    if (!order) throw new NotFoundException('Order not found');

    for (const product of order.products) {
      product.order = null;
      product.orderId = null;
      await this.productsRepository.save(product);
    }

    return await this.ordersRepository.remove(order);
  }

  async getOrderWithProducts(orderId: number, type = 'all', page = 1, limit = 10) {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const queryBuilder = this.productsRepository.createQueryBuilder('product')
      .where('product.orderId = :orderId', { orderId });

    if (type !== 'all') {
      queryBuilder.andWhere('product.type = :type', { type });
    }

    queryBuilder
      .orderBy('product.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    const totalUSD = products.reduce((sum, p) => {
      const usdPrice = p.price.find(pr => pr.symbol === 'USD');
      return sum + (usdPrice?.value || 0);
    }, 0);
    const totalUAH = products.reduce((sum, p) => {
      const uahPrice = p.price.find(pr => pr.symbol === 'UAH');
      return sum + (uahPrice?.value || 0);
    }, 0);

    return {
      ...order,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      products,
      totalUSD: products.length ? totalUSD : undefined,
      totalUAH: products.length ? totalUAH : undefined,
    };
  }
}