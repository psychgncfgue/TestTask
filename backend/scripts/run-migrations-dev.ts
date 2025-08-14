import 'reflect-metadata';
import { SeedMouses1680000002000 } from '../src/migrations/1680000002000-SeedMouses';
import { SeedKeyboards1680000001000 } from '../src/migrations/1680000001000-SeedKeyboards';
import { AppDataSource } from '../src/config/data-source';
import { SeedOrders1680000004000 } from '../src/migrations/1680000004000-SeedOrders';
import { SeedMonitors1680000003000 } from '../src/migrations/1680000003000-SeedMonitors';
import { SeedAdminUser1680000005000 } from '../src/migrations/1680000005000-SeedAdminUser';

async function run() {
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    await AppDataSource.initialize();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await new SeedKeyboards1680000001000().up(queryRunner);
    await new SeedMouses1680000002000().up(queryRunner);
    await new SeedMonitors1680000003000().up(queryRunner);

    await new SeedOrders1680000004000().up(queryRunner);

    await new SeedAdminUser1680000005000().up(queryRunner);

    await queryRunner.commitTransaction();
    console.log('✅ All seeds completed successfully!');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error running seeds:', err);
    process.exit(1);
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

run();