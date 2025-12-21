import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './orders.entity';
import { User } from '../users/users.entity';
import { Product } from '../products/products.entity';

// ประกาศโมดูลหลักของระบบ Orders
@Module({
  // ใช้ให้โมดูลนี้รู้จัก Entity ที่เกี่ยวข้องกับ TypeORM
  imports: [TypeOrmModule.forFeature([Order, User, Product])],

  // ระบุว่าโมดูลนี้มี service อะไรบ้าง
  providers: [OrdersService],

  // ระบุ controller ที่อยู่ในโมดูลนี้
  controllers: [OrdersController],
})
export class OrdersModule {}
