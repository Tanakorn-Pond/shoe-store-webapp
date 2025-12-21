import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './products.entity';

// ถ้ามีไฟล์ DTO แยกสำหรับตรวจสอบข้อมูล ก็สามารถใช้แทน Partial<Product> ได้
// import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

// สร้าง Controller สำหรับ route หลัก "/products"
@Controller('products')
export class ProductsController {
  // ฉีด (inject) ProductsService เข้ามาใช้งานใน Controller
  constructor(private readonly products: ProductsService) {}

  // ดึงสินค้าทั้งหมดจากฐานข้อมูล
  @Get()
  getAll() {
    // เรียกใช้ฟังก์ชัน findAll() จาก service เพื่อดึงรายการทั้งหมด
    return this.products.findAll();
  }

  // ดึงข้อมูลสินค้า 1 ชิ้น ตาม id ที่ระบุใน URL
  @Get(':id')
  getOne(@Param('id') id: string) {
    // แปลง id จาก string → number แล้วส่งต่อไปยัง service
    return this.products.findOne(+id);
  }

  // เพิ่มสินค้าชิ้นใหม่ลงในฐานข้อมูล
  // ถ้ามี DTO: ใช้ @Body() body: CreateProductDto แทน Partial<Product>
  @Post()
  create(@Body() body: Partial<Product>) {
    // ใน entity สามารถจัดการ stringify/parse fields sizes และ images ได้เอง
    return this.products.create(body);
  }

  // อัปเดตข้อมูลสินค้าตาม id
  // ถ้ามี DTO: ใช้ @Body() body: UpdateProductDto
  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Product>) {
    // แปลง id เป็น number แล้วอัปเดตผ่าน service
    return this.products.update(+id, body);
  }

  // ลบสินค้าตาม id ที่ระบุ
  @Delete(':id')
  remove(@Param('id') id: string) {
    // เรียกใช้ service เพื่อลบสินค้า
    return this.products.remove(+id);
  }
}
