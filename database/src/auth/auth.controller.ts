import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    
    
    return this.auth.register(dto.email, dto.name, dto.password);
  }

  
  @HttpCode(200)

  
  @Post('login')
  async login(@Body() dto: LoginDto) {
    
    
    const user = await this.auth.validateUser(dto.email, dto.password);

    
    if (!user) return { status: 401, message: 'Invalid credentials' };

    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
