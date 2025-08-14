import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';

export class SeedAdminUser1680000005000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepo = queryRunner.manager.getRepository(User);

    const existing = await userRepo.findOne({ where: { username: 'admin', provider: 'local' } });
    if (existing) return;

    const hashedPassword = await bcrypt.hash('1234', 10);

    const adminUser = userRepo.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      provider: 'local',
      isTwoFactorEnabled: false,
    });

    await userRepo.save(adminUser);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userRepo = queryRunner.manager.getRepository(User);
    await userRepo.delete({ username: 'admin', provider: 'local' });
  }
}