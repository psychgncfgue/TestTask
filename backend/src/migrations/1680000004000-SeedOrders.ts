import { MigrationInterface, QueryRunner } from 'typeorm';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';

export class SeedOrders1680000004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const orderRepo = queryRunner.manager.getRepository(Order);
    const productRepo = queryRunner.manager.getRepository(Product);

    const allProducts = await productRepo.find();

    if (allProducts.length < 60) {
      throw new Error('Expected at least 60 products seeded before orders');
    }

    const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());

    for (let i = 0; i < 3; i++) {
      const order = orderRepo.create({
        title: `Order #${i + 1}`,
        date: new Date().toISOString(),
        description: `This is order number ${i + 1}`,
      });
      const savedOrder = await orderRepo.save(order);

      const productsForOrder = shuffledProducts.slice(i * 15, i * 15 + 15);
      for (const product of productsForOrder) {
        product.orderId = savedOrder.id;
        await productRepo.save(product);
      }
    }

    for (let i = 0; i < 15; i++) {
      const order = orderRepo.create({
        title: `Single Product Order #${i + 1}`,
        date: new Date().toISOString(),
        description: `This order has a single product`,
      });
      const savedOrder = await orderRepo.save(order);

      const product = shuffledProducts[45 + i];
      product.orderId = savedOrder.id;
      await productRepo.save(product);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const orderRepo = queryRunner.manager.getRepository(Order);
    const productRepo = queryRunner.manager.getRepository(Product);

    const ordersToRemove = await orderRepo.find({
      where: [
        { title: 'Order #1' },
        { title: 'Order #2' },
        { title: 'Order #3' },
        ...Array.from({ length: 15 }, (_, i) => ({ title: `Single Product Order #${i + 1}` })),
      ],
    });

    for (const order of ordersToRemove) {
      await productRepo
        .createQueryBuilder()
        .update(Product)
        .set({ orderId: null })
        .where('orderId = :orderId', { orderId: order.id })
        .execute();
    }

    await orderRepo.delete(ordersToRemove.map(o => o.id));
  }
}