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
  
  constructor(private readonly users: UsersService) {}

  
  
  @Get()
  getAll() {
    
    
    return this.users.findAll();
  }

  
  
  @Get(':id')
  getOne(@Param('id') id: string) {
    
    
    return this.users.findOne(+id);
  }

  
  
  @Post()
  create(@Body() body: Partial<User>) {
    
    return this.users.create(body);
  }

  
  
  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<User>) {
    
    return this.users.update(+id, body);
  }

  
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    
    return this.users.remove(+id);
  }
}
