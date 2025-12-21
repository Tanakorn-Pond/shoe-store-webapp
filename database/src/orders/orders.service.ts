import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from './orders.entity';
import { User } from '../users/users.entity';
import { Product } from '../products/products.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orders: Repository<Order>,
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Product) private products: Repository<Product>,
  ) {}

  // ดึงออเดอร์ทั้งหมด
  async findAll() {
    return this.orders.find();
  }

  // ดึงออเดอร์ตาม id
  async findOne(id: number) {
    const found = await this.orders.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Order not found');
    return found;
  }

  // สร้างออเดอร์ใหม่
  async create(payload: {
    userId: number;
    items: {
      productId: number;
      name: string;
      price: number;
      qty: number;
      size?: string;
    }[];
    shipping?: number;
  }) {
    // ตัดสต็อก + สร้างออเดอร์
    return this.orders.manager.transaction(async (em) => {
      const userRepo = em.getRepository(User);
      const productRepo = em.getRepository(Product);
      const orderRepo = em.getRepository(Order);

      // ตรวจว่ามี user จริงไหม
      const user = await userRepo.findOne({ where: { id: payload.userId } });
      if (!user) throw new NotFoundException('User not found');

      // ต้องมี items อย่างน้อย 1 ชิ้น
      if (!payload.items || payload.items.length === 0) {
        throw new ConflictException('Order must contain at least one item');
      }

      // รวบรวม productId ที่ไม่ซ้ำ
      const ids = Array.from(new Set(payload.items.map((i) => i.productId)));

      // ดึงสินค้าจาก DB ตาม id
      const dbProducts = await productRepo.findBy({ id: In(ids) });
      const map = new Map<number, Product>(dbProducts.map((p) => [p.id, p]));

      // ตรวจสอบว่าแต่ละ item มีสินค้าอยู่จริงและสต็อกพอ
      for (const it of payload.items) {
        const p = map.get(it.productId);
        if (!p)
          throw new NotFoundException(`Product ${it.productId} not found`);
        if ((p.stock ?? 0) < it.qty)
          throw new ConflictException(
            `Insufficient stock for product ${p.name}`,
          );
      }

      // คำนวณยอดโดยใช้ "ราคาใน DB"
      let subtotal = 0;
      const snapshotItems = payload.items.map((it) => {
        const p = map.get(it.productId)!; // p ต้องมีเพราะเช็คแล้ว
        const linePrice = Number(p.price); // ราคาใน DB (decimal → number)
        subtotal += linePrice * it.qty; // สะสมยอดรวม
        return {
          productId: p.id, // เก็บสแน็ปช็อตชื่อ/ราคา ณ ตอนสั่ง
          name: p.name,
          price: linePrice,
          qty: it.qty,
          size: it.size,
        };
      });
      const shipping = payload.shipping ?? 0; // ค่าส่ง (ดีฟอลต์ 0)
      const total = subtotal + shipping; // ยอดสุทธิ

      // ตัดสต็อกในหน่วยความจำ (Entity) แล้วค่อย save ชุดเดียว
      for (const it of payload.items) {
        const p = map.get(it.productId)!;
        p.stock = (p.stock ?? 0) - it.qty;
      }
      await productRepo.save(dbProducts); // บันทึกสต็อกใหม่

      // สร้าง entity Order พร้อมข้อมูลที่คงที่
      const entity = orderRepo.create({
        user,
        items: snapshotItems, // เก็บรายการเป็น JSON
        subtotal: parseFloat(subtotal.toFixed(2)), // ปัดทศนิยม 2 ตำแหน่ง
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        status: 'pending', // สถานะเริ่มต้น
      });
      return orderRepo.save(entity); // บันทึกออเดอร์
    });
  }

  // อัปเดตสถานะออเดอร์
  updateStatus(id: number, status: string) {
    return this.orders.update(id, { status });
  }

  // ลบออเดอร์ตาม id
  remove(id: number) {
    return this.orders.delete(id);
  }
}
