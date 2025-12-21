import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  // ดึงรายการคำสั่งซื้อทั้งหมด
  @Get() getAll() {
    // เรียกเมธอด findAll() จาก service เพื่อดึงข้อมูลทั้งหมด
    return this.orders.findAll();
  }

  // ใช้ดึงคำสั่งซื้อ 1 รายการตาม id
  @Get(':id') getOne(@Param('id') id: string) {
    // แปลง id จาก string เป็น number แล้วส่งให้ service
    return this.orders.findOne(+id);
  }

  // ใช้สร้างคำสั่งซื้อใหม่
  @Post() create(@Body() body: any) {
    // รับข้อมูลคำสั่งซื้อจาก body
    return this.orders.create(body);
  }

  // ใช้อัปเดตสถานะคำสั่งซื้อ
  @Patch(':id/status') setStatus(
    @Param('id') id: string, // ดึง id จาก path
    @Body('status') status: string, // ดึงค่า status จาก body
  ) {
    // เรียก service เพื่ออัปเดตสถานะคำสั่งซื้อ
    return this.orders.updateStatus(+id, status);
  }

  // ใช้ลบคำสั่งซื้อ ตาม id
  @Delete(':id') remove(@Param('id') id: string) {
    // เรียก service เพื่อลบคำสั่งซื้อจากฐานข้อมูล
    return this.orders.remove(+id);
  }
}
