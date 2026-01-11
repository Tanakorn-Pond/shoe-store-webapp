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





@Controller('products')
export class ProductsController {
  
  constructor(private readonly products: ProductsService) {}

  
  @Get()
  getAll() {
    
    return this.products.findAll();
  }

  
  @Get(':id')
  getOne(@Param('id') id: string) {
    
    return this.products.findOne(+id);
  }

  
  
  @Post()
  create(@Body() body: Partial<Product>) {
    
    return this.products.create(body);
  }

  
  
  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Product>) {
    
    return this.products.update(+id, body);
  }

  
  @Delete(':id')
  remove(@Param('id') id: string) {
    
    return this.products.remove(+id);
  }
}
