import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// ทุก endpoint ในนี้จะขึ้นต้นด้วย /auth
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  // ใช้สำหรับ "สมัครสมาชิก"
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // ดึงข้อมูล email, name, password จาก body ผ่าน dto
    // ส่งต่อให้ AuthService ทำงาน
    return this.auth.register(dto.email, dto.name, dto.password);
  }

  // กำหนดให้ endpoint นี้ส่งสถานะ (OK) เมื่อสำเร็จ
  @HttpCode(200)

  // ใช้สำหรับ "เข้าสู่ระบบ"
  @Post('login')
  async login(@Body() dto: LoginDto) {
    // เรียกใช้ฟังก์ชัน validateUser() จาก AuthService
    // เพื่อตรวจสอบว่า email/password ถูกต้องหรือไม่
    const user = await this.auth.validateUser(dto.email, dto.password);

    // ถ้าไม่พบผู้ใช้หรือรหัสผ่านผิด
    if (!user) return { status: 401, message: 'Invalid credentials' };

    // ถ้าล็อกอินสำเร็จ ส่งข้อมูลผู้ใช้กลับ
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
