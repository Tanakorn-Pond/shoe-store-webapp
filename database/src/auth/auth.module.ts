import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

// สร้างโมดูลหลักของระบบ Authentication
@Module({
  // โมดูลอื่นที่ต้องใช้งานร่วมกัน
  imports: [UsersModule],

  // รายการ service ที่โมดูลนี้ใช้
  providers: [AuthService],

  // รายการ controller ที่อยู่ในโมดูลนี้
  controllers: [AuthController],

  // กำหนด service ไหนที่อยากให้โมดูลอื่นเรียกใช้ได้
  exports: [AuthService],
})
export class AuthModule {}
