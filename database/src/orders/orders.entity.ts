// ใช้สำหรับสร้าง Entity (ตารางในฐานข้อมูล)
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

// ไม่ใช่ Entity จริง แต่เป็น interface ใช้ภายในคอลัมน์ `items`
export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
  size?: string;
}

// ประกาศ Entity ชื่อ "orders" (ตารางในฐานข้อมูล)
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // ความสัมพันธ์แบบ Many-to-One กับตาราง users
  @ManyToOne(() => User, { eager: true, nullable: false })
  user: User;

  // เก็บ "รายการสินค้า" ในออเดอร์
  @Column('json')
  items: OrderItem[];

  // ราคารวมของสินค้าก่อนรวมค่าส่ง
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  // ค่าส่งสินค้า (default = 0)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  shipping: number;

  // ราคารวมสุดท้าย (subtotal + shipping)
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  // สถานะของคำสั่งซื้อ
  @Column({ default: 'pending' })
  status: string;

  // วันที่สร้างอัตโนมัติ
  @CreateDateColumn()
  createdAt: Date;

  // วันที่อัปเดตล่าสุด
  @UpdateDateColumn()
  updatedAt: Date;
}
