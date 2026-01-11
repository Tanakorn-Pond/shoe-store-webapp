import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './orders.entity';
import { User } from '../users/users.entity';
import { Product } from '../products/products.entity';


@Module({
  
  imports: [TypeOrmModule.forFeature([Order, User, Product])],

  
  providers: [OrdersService],

  
  controllers: [OrdersController],
})
export class OrdersModule {}
