import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type FindOneOptions } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  // ใช้ dependency injection ดึง Repository<User> มาใช้งาน
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  // ดึงข้อมูลผู้ใช้ทั้งหมดจากตาราง users
  findAll() {
    // SELECT * FROM users;
    return this.repo.find();
  }

  // ดึงข้อมูลผู้ใช้ตาม id
  findOne(id: number) {
    // SELECT * FROM users WHERE id
    return this.repo.findOne({ where: { id } });
  }

  // ดึงข้อมูลผู้ใช้ตาม email (ใช้ตอนล็อกอิน)
  findByEmail(email: string) {
    const opts: FindOneOptions<User> = {
      where: { email }, // เงื่อนไขค้นหา
      select: [
        'id',
        'email',
        'name',
        'passwordHash',
        'role',
        'createdAt',
        'updatedAt',
      ],
    } as unknown as FindOneOptions<User>;
    return this.repo.findOne(opts);
  }

  // สร้างผู้ใช้ใหม่
  create(data: Partial<User>) {
    return this.repo.save(this.repo.create(data));
  }

  // อัปเดตข้อมูลผู้ใช้
  update(id: number, data: Partial<User>) {
    return this.repo.update(id, data);
  }

  // ลบผู้ใช้ตาม id
  remove(id: number) {
    return this.repo.delete(id);
  }
}
