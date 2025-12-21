// ใช้เพื่อตรวจสอบค่าของข้อมูลที่รับเข้ามาใน
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

// ใช้เป็นโครงสร้างข้อมูลตอนผู้ใช้ส่งคำขอล็อกอิน (email + password)
export class LoginDto {
  // ถ้าไม่ถูกต้อง จะแสดงข้อความ "Invalid email format"
  @IsEmail({}, { message: 'Invalid email format' })

  // ถ้าผู้ใช้ไม่กรอก email จะขึ้น "Email is required"
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  // ถ้าผู้ใช้ส่งเป็นตัวเลขหรือค่าอื่น จะแสดง "Password must be a string"
  // ถ้าผู้ใช้ไม่กรอก จะขึ้น "Password is required"
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
