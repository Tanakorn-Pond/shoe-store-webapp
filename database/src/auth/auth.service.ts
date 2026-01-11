import { Injectable, ConflictException } from '@nestjs/common';
import type { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {
  
  constructor(private usersService: UsersService) {}

  
  async register(email: string, name: string, plainPassword: string) {
    
    const exists = await this.usersService.findByEmail(email);
    if (exists) throw new ConflictException('Email already registered');

    try {
      
      const user = await this.usersService.create({
        email,
        name,
        passwordHash: plainPassword,
      });

      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (err: unknown) {
      
      const maybe = err as { code?: string; errno?: number };
      const code = maybe?.code ?? maybe?.errno;

      
      if (code === 'ER_DUP_ENTRY' || code === 1062) {
        throw new ConflictException('Email already registered');
      }
      throw err;
    }
  }

  
  async validateUser(email: string, password: string) {
    
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    
    const stored =
      (user as User & { passwordHash?: string }).passwordHash ?? '';

    
    if (stored !== password) return null;

    
    return user;
  }
}
