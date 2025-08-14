import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email', 'provider', 'providerId'])
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'boolean', default: false })
  isTwoFactorEnabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarUrl?: string;

  // Для OAuth
  @Column({ nullable: false, default: 'local' })
  provider: 'local' | 'google' | 'apple';

  @Column({ nullable: true })
  providerId?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Column({ nullable: true })
  lastPaymentIntentId?: string;
}