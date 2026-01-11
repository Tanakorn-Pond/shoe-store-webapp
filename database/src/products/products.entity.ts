import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('products')
export class Product {
  
  @PrimaryGeneratedColumn()
  id: number;

  
  @Index()
  @Column({ length: 120 })
  name: string; 

  
  @Column('text', { nullable: true })
  description?: string;

  
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  
  @Column({ default: 0 })
  stock: number;

  
  @Column({ length: 60 })
  brand: string;

  
  @Column('text', {
    nullable: true,
    transformer: {
      
      to: (value: number[] | string | null | undefined) =>
        Array.isArray(value) ? JSON.stringify(value) : (value ?? null),

      
      from: (value: string | null) => {
        if (value == null) return [] as number[];
        try {
          const parsed = JSON.parse(value) as unknown;
          
          return Array.isArray(parsed)
            ? parsed.map((v) => Number(v))
            : 
              String(value)
                .split(',')
                .map((s) => Number(String(s).trim()));
        } catch {
          
          return String(value)
            .split(',')
            .filter((s) => s.length > 0)
            .map((s) => Number(s.trim()));
        }
      },
    },
  })
  sizes?: number[];

  
  @Column('text', {
    nullable: true,
    transformer: {
      
      to: (value: string[] | string | null | undefined) =>
        Array.isArray(value) ? JSON.stringify(value) : (value ?? null),

      
      from: (value: string | null) => {
        if (value == null) return [] as string[];
        try {
          const parsed = JSON.parse(value) as unknown;
          return Array.isArray(parsed)
            ? parsed.map((v) => String(v))
            : String(value)
                .split(',')
                .map((s) => String(s).trim());
        } catch {
          return String(value)
            .split(',')
            .filter((s) => s.length > 0)
            .map((s) => String(s).trim());
        }
      },
    },
  })
  images?: string[];

  
  @CreateDateColumn({
    type: 'timestamp', 
    precision: 6, 
    default: () => 'CURRENT_TIMESTAMP(6)', 
  })
  createdAt: Date;

  
  @UpdateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
