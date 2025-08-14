import { Product } from '../product/product.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedMouses1680000002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const products: Partial<Product>[] = [];

    const photoUrl =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyroKRDtar2SqNtDl53dnbbXP090gSuG_dKRqeZI6dWx4T3VHtqbhgeh4xK9l_Hs4LlPw&usqp=CAU';

    for (let i = 1; i <= 20; i++) {
      const serial = 2000 + i * 5;
      const isNew = i % 2 === 0;
      const priceUSD = 50 + i * 5;
      const priceUAH = priceUSD * 27;

      products.push({
        serialNumber: serial,
        isNew,
        photo: photoUrl,
        title: `Mouse Model ${i}`,
        type: 'Mouses',
        specification: `DPI: ${800 + i * 100}, Buttons: ${3 + (i % 3)}, Wireless: ${i % 2 === 0}`,
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
      `DELETE FROM product WHERE title LIKE 'Mouse Model %'`
    );
  }
}