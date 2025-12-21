// ใช้สำหรับตรวจสอบความถูกต้องของข้อมูลที่ผู้ใช้ส่งมา
import { IsEmail, IsString, MinLength } from 'class-validator';

// ใช้เป็นโครงสร้างข้อมูลเวลาผู้ใช้ "สมัครสมาชิก" (register)
export class RegisterDto {
  // ตรวจสอบว่า email ต้องเป็นรูปแบบอีเมลที่ถูกต้อง
  @IsEmail()
  email: string;

  // ตรวจสอบว่า name ต้องเป็น string
  @IsString()
  name: string;

  // ตรวจสอบว่า password ต้องมีความยาวอย่างน้อย 8 ตัวอักษร
  @IsString()
  @MinLength(8)
  password: string;
}
