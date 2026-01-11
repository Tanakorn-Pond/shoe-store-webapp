import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from './orders.entity';
import { User } from '../users/users.entity';
import { Product } from '../products/products.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orders: Repository<Order>,
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Product) private products: Repository<Product>,
  ) {}

  
  async findAll() {
    return this.orders.find();
  }

  
  async findOne(id: number) {
    const found = await this.orders.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Order not found');
    return found;
  }

  
  async create(payload: {
    userId: number;
    items: {
      productId: number;
      name: string;
      price: number;
      qty: number;
      size?: string;
    }[];
    shipping?: number;
  }) {
    
    return this.orders.manager.transaction(async (em) => {
      const userRepo = em.getRepository(User);
      const productRepo = em.getRepository(Product);
      const orderRepo = em.getRepository(Order);

      
      const user = await userRepo.findOne({ where: { id: payload.userId } });
      if (!user) throw new NotFoundException('User not found');

      
      if (!payload.items || payload.items.length === 0) {
        throw new ConflictException('Order must contain at least one item');
      }

      
      const ids = Array.from(new Set(payload.items.map((i) => i.productId)));

      
      const dbProducts = await productRepo.findBy({ id: In(ids) });
      const map = new Map<number, Product>(dbProducts.map((p) => [p.id, p]));

      
      for (const it of payload.items) {
        const p = map.get(it.productId);
        if (!p)
          throw new NotFoundException(`Product ${it.productId} not found`);
        if ((p.stock ?? 0) < it.qty)
          throw new ConflictException(
            `Insufficient stock for product ${p.name}`,
          );
      }

      
      let subtotal = 0;
      const snapshotItems = payload.items.map((it) => {
        const p = map.get(it.productId)!; 
        const linePrice = Number(p.price); 
        subtotal += linePrice * it.qty; 
        return {
          productId: p.id, 
          name: p.name,
          price: linePrice,
          qty: it.qty,
          size: it.size,
        };
      });
      const shipping = payload.shipping ?? 0; 
      const total = subtotal + shipping; 

      
      for (const it of payload.items) {
        const p = map.get(it.productId)!;
        p.stock = (p.stock ?? 0) - it.qty;
      }
      await productRepo.save(dbProducts); 

      
      const entity = orderRepo.create({
        user,
        items: snapshotItems, 
        subtotal: parseFloat(subtotal.toFixed(2)), 
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        status: 'pending', 
      });
      return orderRepo.save(entity); 
    });
  }

  
  updateStatus(id: number, status: string) {
    return this.orders.update(id, { status });
  }

  
  remove(id: number) {
    return this.orders.delete(id);
  }
}
