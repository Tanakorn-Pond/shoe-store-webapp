import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';

@Module({
  // imports — นำเข้าโมดูลอื่น ๆ ที่จำเป็นต้องใช้ในโมดูลนี้
  // เปิดการเชื่อมต่อ Entity ชื่อ User ให้ใช้กับ Repository ใน service นี้ได้
  imports: [TypeOrmModule.forFeature([User])],

  providers: [UsersService],

  // ระบุ controller ที่จะคอยรับ HTTP request ที่เกี่ยวกับ users
  controllers: [UsersController],

  // exports — export สิ่งที่ module อื่นสามารถนำไปใช้ต่อได้
  exports: [UsersService],
})
export class UsersModule {}
