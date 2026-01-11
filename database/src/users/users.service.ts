import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type FindOneOptions } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  
  findAll() {
    
    return this.repo.find();
  }

  
  findOne(id: number) {
    
    return this.repo.findOne({ where: { id } });
  }

  
  findByEmail(email: string) {
    const opts: FindOneOptions<User> = {
      where: { email }, 
      select: [
        'id',
        'email',
        'name',
        'passwordHash',
        'role',
        'createdAt',
        'updatedAt',
      ],
    } as unknown as FindOneOptions<User>;
    return this.repo.findOne(opts);
  }

  
  create(data: Partial<User>) {
    return this.repo.save(this.repo.create(data));
  }

  
  update(id: number, data: Partial<User>) {
    return this.repo.update(id, data);
  }

  
  remove(id: number) {
    return this.repo.delete(id);
  }
}
