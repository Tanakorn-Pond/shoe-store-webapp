import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  // Inject Repository ของ Entity `Product`
  // ทำให้สามารถใช้คำสั่งเช่น find(), save(), update(), delete() ได้เลย
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  // ดึงสินค้าทั้งหมดจากฐานข้อมูล
  findAll() {
    // TypeORM อ่านข้อมูลจาก DB และแปลง field sizes/images กลับเป็น array
    return this.repo.find();
  }

  // ดึงสินค้า 1 ชิ้นตาม id
  findOne(id: number) {
    // ใช้ where: { id } เพื่อระบุเงื่อนไข
    return this.repo.findOne({ where: { id } });
  }

  // เพิ่มสินค้าใหม่
  create(data: Partial<Product>) {
    // ป้องกันไม่ให้ frontend ส่ง id=0 หรือ id ที่ไม่ควรมีเข้ามา
    const rest = { ...(data ?? {}) } as Partial<Product> & {
      id?: number | null;
    };

    // ถ้า id ไม่มีค่า หรือเท่ากับ 0 ให้ลบทิ้ง (เพื่อให้ DB generate id เอง)
    if (rest.id == null || rest.id === 0) {
      delete (rest as { id?: number }).id;
    }

    // repo.create() จะสร้าง instance ของ Product
    // repo.save() จะบันทึกข้อมูลลง DB
    return this.repo.save(this.repo.create(rest));
  }

  // อัปเดตข้อมูลสินค้า
  async update(id: number, data: Partial<Product>) {
    // update() จะอัปเดตเฉพาะ field ที่ส่งมา
    await this.repo.update(id, data);

    // จากนั้นดึงข้อมูลล่าสุดกลับมา (เพื่อส่งให้ frontend)
    return this.repo.findOne({ where: { id } });
  }

  // ลบสินค้า
  remove(id: number) {
    // delete() จะลบสินค้าตาม id (ถ้ามี)
    return this.repo.delete(id);
  }
}
