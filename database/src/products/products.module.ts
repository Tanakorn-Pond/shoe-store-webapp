import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

// ประกาศโมดูลสินค้า
@Module({
  // imports: บอกว่าโมดูลนี้ใช้ Entity ตัวใดกับ TypeORM
  // TypeOrmModule.forFeature([...]) ทำให้สามารถ Inject Repository ของ Product ได้ใน Service
  imports: [TypeOrmModule.forFeature([Product])],

  // บอกว่าในโมดูลนี้มี Service อะไรบ้าง
  providers: [ProductsService],

  // ระบุ Controller ที่อยู่ในโมดูลนี้
  controllers: [ProductsController],

  // ระบุ service ที่อยากให้โมดูลอื่น
  exports: [ProductsService],
})
export class ProductsModule {}
