import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  
  
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  
  findAll() {
    
    return this.repo.find();
  }

  
  findOne(id: number) {
    
    return this.repo.findOne({ where: { id } });
  }

  
  create(data: Partial<Product>) {
    
    const rest = { ...(data ?? {}) } as Partial<Product> & {
      id?: number | null;
    };

    
    if (rest.id == null || rest.id === 0) {
      delete (rest as { id?: number }).id;
    }

    
    
    return this.repo.save(this.repo.create(rest));
  }

  
  async update(id: number, data: Partial<Product>) {
    
    await this.repo.update(id, data);

    
    return this.repo.findOne({ where: { id } });
  }

  
  remove(id: number) {
    
    return this.repo.delete(id);
  }
}
