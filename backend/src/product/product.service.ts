import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Price, Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async findAll(type: string, page = 1, limit = 10) {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    if (type !== 'all') {
      queryBuilder.where('product.type = :type', { type });
    }

    queryBuilder
      .orderBy('product.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    const typesRaw = await this.productsRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.type', 'type')
      .getRawMany();
    const productTypes = typesRaw.map(row => row.type);

    const totalPages = Math.ceil(total / limit);

    return {
      currentPage: page,
      totalPages,
      totalProducts: total,
      productTypes,
      products: items,
    };
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

async getPricesByType(): Promise<{ type: string; prices: Price[] }[]> {
  const products = await this.productsRepository
    .createQueryBuilder('product')
    .select(['product.type', 'product.price'])
    .getMany();

  const grouped = products.reduce((acc, product) => {
    if (!acc[product.type]) {
      acc[product.type] = [];
    }
    acc[product.type].push(...(product.price ?? []));
    return acc;
  }, {} as Record<string, Price[]>);

  const result = Object.entries(grouped).map(([type, prices]) => ({
    type,
    prices,
  }));

  return result;
}
}