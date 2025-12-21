import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

// @Entity() ใช้บอก TypeORM ว่าคลาสนี้คือ “ตารางในฐานข้อมูล”
@Entity('users')
export class User {
  // คอลัมน์ id
  // @PrimaryGeneratedColumn() primary key ที่เป็น auto-increment (เพิ่มอัตโนมัติ)
  @PrimaryGeneratedColumn()
  id: number;

  // คอลัมน์ email
  // @Index({ unique: true }) ห้ามซ้ำในฐานข้อมูล (unique constraint)
  // @Column({ length: 120 }) จำกัดความยาวสูงสุด 120 ตัวอักษร
  @Index({ unique: true })
  @Column({ length: 120 })
  email: string;

  // คอลัมน์ name — ชื่อผู้ใช้
  // @Column({ length: 80 }) กำหนดให้เก็บได้ไม่เกิน 80 ตัวอักษร
  @Column({ length: 80 })
  name: string;

  // คอลัมน์ passwordHash — เก็บรหัสผ่าน
  // @Column({ select: false })
  // เวลา query ข้อมูล user จะ **ไม่ดึงฟิลด์นี้ออกมาโดยอัตโนมัติ
  // เพื่อความปลอดภัย
  @Column({ select: false })
  passwordHash: string;

  // คอลัมน์ role — บอกสิทธิ์ของผู้ใช้
  // มีค่าเริ่มต้น เป็น 'customer'
  @Column({ default: 'customer' })
  role: string;

  // คอลัมน์ createdAt — วันที่สร้าง record
  // @CreateDateColumn() จะตั้งค่าอัตโนมัติเมื่อสร้าง record ครั้งแรก
  @CreateDateColumn()
  createdAt: Date;

  // คอลัมน์ updatedAt — วันที่แก้ไขล่าสุด
  // @UpdateDateColumn() จะอัปเดตอัตโนมัติเมื่อมีการเปลี่ยนแปลงข้อมูล
  @UpdateDateColumn()
  updatedAt: Date;
}
