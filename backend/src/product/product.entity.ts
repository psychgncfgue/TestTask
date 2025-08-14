import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../order/order.entity';

export interface Price {
  value: number;
  symbol: string;
  isDefault: boolean;
}


@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serialNumber: number;

  @Column()
  isNew: boolean;

  @Column()
  photo: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  specification: string;

  @Column('json')
  guarantee: {
    start: string;
    end: string;
  };

  @Column('json')
  price: Price[];

  @ManyToOne(() => Order, (order) => order.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'orderId' })
  order: Order | null;

  @Column({ nullable: true })
  orderId: number | null;

  @Column()
  date: string;
}