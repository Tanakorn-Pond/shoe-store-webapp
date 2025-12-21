import { Injectable, ConflictException } from '@nestjs/common';
import type { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';

// บอก NestJS ว่านี่คือ Service ที่สามารถถูก inject เข้าไปใน module อื่นได้
@Injectable()
export class AuthService {
  // Inject UsersService ผ่าน constructor
  constructor(private usersService: UsersService) {}

  // ใช้ตอนสมัครสมาชิก
  async register(email: string, name: string, plainPassword: string) {
    // ตรวจสอบก่อนว่า email นี้เคยมีในระบบหรือยัง
    const exists = await this.usersService.findByEmail(email);
    if (exists) throw new ConflictException('Email already registered');

    try {
      // ถ้ายังไม่มี เรียก UsersService.create() เพื่อสร้างผู้ใช้ใหม่
      const user = await this.usersService.create({
        email,
        name,
        passwordHash: plainPassword,
      });

      // คืนค่าข้อมูลผู้ใช้
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (err: unknown) {
      // ถ้าเกิด error จากฐานข้อมูล
      const maybe = err as { code?: string; errno?: number };
      const code = maybe?.code ?? maybe?.errno;

      // ถ้า error เกิดจาก email ซ้ำ (รหัส error ของ MySQL)
      if (code === 'ER_DUP_ENTRY' || code === 1062) {
        throw new ConflictException('Email already registered');
      }
      throw err;
    }
  }

  // ใช้ล็อกอิน
  async validateUser(email: string, password: string) {
    // ค้นหาผู้ใช้จาก email
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    // ดึงค่า passwordHash จาก user (รองรับกรณี field อาจไม่มี)
    const stored =
      (user as User & { passwordHash?: string }).passwordHash ?? '';

    // ถ้ารหัสผ่านไม่ตรง คืนค่า null
    if (stored !== password) return null;

    // ถ้ารหัสตรง คืนข้อมูล user
    return user;
  }
}
