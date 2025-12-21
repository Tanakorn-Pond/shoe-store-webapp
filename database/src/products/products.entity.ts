import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('products')
export class Product {
  // คอลัมน์ id (Primary Key) — เพิ่มอัตโนมัติ
  @PrimaryGeneratedColumn()
  id: number;

  // สร้าง index ที่ column name เพื่อให้ค้นหาชื่อสินค้า
  @Index()
  @Column({ length: 120 })
  name: string; // ชื่อสินค้า

  // รายละเอียดสินค้า
  @Column('text', { nullable: true })
  description?: string;

  // ราคาสินค้า
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  // จำนวนสินค้าในสต็อก
  @Column({ default: 0 })
  stock: number;

  // ยี่ห้อสินค้า
  @Column({ length: 60 })
  brand: string;

  // ขนาดรองเท้าที่มี
  @Column('text', {
    nullable: true,
    transformer: {
      // แปลงค่าก่อนบันทึกลง DB
      to: (value: number[] | string | null | undefined) =>
        Array.isArray(value) ? JSON.stringify(value) : (value ?? null),

      // แปลงค่าจาก DB เป็น array อีกครั้ง
      from: (value: string | null) => {
        if (value == null) return [] as number[];
        try {
          const parsed = JSON.parse(value) as unknown;
          // ถ้าได้ array คืนค่าตรง ๆ
          return Array.isArray(parsed)
            ? parsed.map((v) => Number(v))
            : // ถ้าไม่ใช่ array แยกด้วยเครื่องหมาย ,
              String(value)
                .split(',')
                .map((s) => Number(String(s).trim()));
        } catch {
          // ถ้า parse ไม่ได้ ใช้วิธี split , ธรรมดา
          return String(value)
            .split(',')
            .filter((s) => s.length > 0)
            .map((s) => Number(s.trim()));
        }
      },
    },
  })
  sizes?: number[];

  // ภาพสินค้าหลายรูป (เก็บเป็น array ของ URL string)
  @Column('text', {
    nullable: true,
    transformer: {
      // to(): แปลง array → JSON ก่อนเก็บในฐานข้อมูล
      to: (value: string[] | string | null | undefined) =>
        Array.isArray(value) ? JSON.stringify(value) : (value ?? null),

      // from(): แปลง JSON หรือ string → array
      from: (value: string | null) => {
        if (value == null) return [] as string[];
        try {
          const parsed = JSON.parse(value) as unknown;
          return Array.isArray(parsed)
            ? parsed.map((v) => String(v))
            : String(value)
                .split(',')
                .map((s) => String(s).trim());
        } catch {
          return String(value)
            .split(',')
            .filter((s) => s.length > 0)
            .map((s) => String(s).trim());
        }
      },
    },
  })
  images?: string[];

  // วันที่สร้าง (ระบบจะใส่ให้อัตโนมัติ)
  @CreateDateColumn({
    type: 'timestamp', // ใช้ timestamp หรือ datetime ก็ได้
    precision: 6, // ความละเอียด microsecond
    default: () => 'CURRENT_TIMESTAMP(6)', // ตั้งค่าเริ่มต้น
  })
  createdAt: Date;

  // วันที่อัปเดตล่าสุด (อัปเดตอัตโนมัติทุกครั้งเมื่อข้อมูลเปลี่ยน)
  @UpdateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
