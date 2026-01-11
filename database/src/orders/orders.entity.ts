
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';


export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
  size?: string;
}


@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  
  @ManyToOne(() => User, { eager: true, nullable: false })
  user: User;

  
  @Column('json')
  items: OrderItem[];

  
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  shipping: number;

  
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  
  @Column({ default: 'pending' })
  status: string;

  
  @CreateDateColumn()
  createdAt: Date;

  
  @UpdateDateColumn()
  updatedAt: Date;
}
