import { Product } from '../product/product.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedMonitors1680000003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const products: Partial<Product>[] = [];

    for (let i = 1; i <= 20; i++) {
      const serial = 1000 + i * 5;
      const isNew = i % 2 === 0;
      const priceUSD = 100 + i * 10;
      const priceUAH = priceUSD * 27;

      products.push({
        serialNumber: serial,
        isNew,
        photo: 'https://img.freepik.com/premium-photo/computer-monitor-white-background-blank-black-screen_143092-2446.jpg',
        title: `Monitor Model ${i}`,
        type: 'Monitors',
        specification: `Resolution: 1920x1080, Size: ${21 + (i % 5)} inch, Refresh Rate: ${60 + (i % 3) * 30}Hz`,
        guarantee: {
          start: '2024-01-01 00:00:00',
          end: '2026-01-01 00:00:00',
        },
        price: [
          { value: priceUSD, symbol: 'USD', isDefault: false },
          { value: priceUAH, symbol: 'UAH', isDefault: true },
        ],
        date: '2024-01-01 00:00:00',
      });
    }

    await queryRunner.manager.getRepository(Product).insert(products);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM product WHERE title LIKE 'Monitor Model %'`
    );
  }
}