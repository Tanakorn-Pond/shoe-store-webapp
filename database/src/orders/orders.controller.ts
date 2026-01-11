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

  
  @Get() getAll() {
    
    return this.orders.findAll();
  }

  
  @Get(':id') getOne(@Param('id') id: string) {
    
    return this.orders.findOne(+id);
  }

  
  @Post() create(@Body() body: any) {
    
    return this.orders.create(body);
  }

  
  @Patch(':id/status') setStatus(
    @Param('id') id: string, 
    @Body('status') status: string, 
  ) {
    
    return this.orders.updateStatus(+id, status);
  }

  
  @Delete(':id') remove(@Param('id') id: string) {
    
    return this.orders.remove(+id);
  }
}
