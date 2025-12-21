import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
  // ใช้ dependency injection (Nest จะ inject instance ของ UsersService เข้ามาให้)
  constructor(private readonly users: UsersService) {}

  // GET /users
  // ดึงผู้ใช้ทั้งหมดจากฐานข้อมูล
  @Get()
  getAll() {
    // เรียก service method: findAll()
    // คืนค่าผลลัพธ์เป็น Promise ของรายการผู้ใช้ทั้งหมด
    return this.users.findAll();
  }

  // GET /users/:id
  // ดึงข้อมูลผู้ใช้ตาม id
  @Get(':id')
  getOne(@Param('id') id: string) {
    // @Param('id') จะดึงค่าจาก URL เช่น /users/5  id = "5"
    // ใช้เครื่องหมาย + เพื่อแปลง string เป็น number
    return this.users.findOne(+id);
  }

  // POST /users
  // เพิ่มผู้ใช้ใหม่
  @Post()
  create(@Body() body: Partial<User>) {
    // @Body() ข้อมูลที่ส่งมาจาก request body (JSON)
    return this.users.create(body);
  }

  // PUT /users/:id
  // อัปเดตข้อมูลผู้ใช้ที่มีอยู่
  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<User>) {
    // อัปเดตข้อมูลในฐานข้อมูลโดยส่ง id และข้อมูลใหม่ไปที่ service
    return this.users.update(+id, body);
  }

  // DELETE /users/:id
  // ลบผู้ใช้ตาม id
  @Delete(':id')
  remove(@Param('id') id: string) {
    // ลบข้อมูลผู้ใช้จากฐานข้อมูล
    return this.users.remove(+id);
  }
}
