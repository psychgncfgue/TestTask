import { Product } from '../product/product.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedKeyboards1680000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const products: Partial<Product>[] = [];

    const photoUrl =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0z24DXk1FmG0ISDLt0vPVnDK5sucA6N7B0A&s';

    for (let i = 1; i <= 20; i++) {
      const serial = 3000 + i * 5;
      const isNew = i % 2 === 0;
      const priceUSD = 70 + i * 7;
      const priceUAH = priceUSD * 27;

      products.push({
        serialNumber: serial,
        isNew,
        photo: photoUrl,
        title: `Keyboard Model ${i}`,
        type: 'Keyboards',
        specification: `Layout: QWERTY, Switch Type: Mechanical, Backlight: ${i % 2 === 0 ? 'RGB' : 'None'}`,
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
      `DELETE FROM product WHERE title LIKE 'Keyboard Model %'`
    );
  }
}