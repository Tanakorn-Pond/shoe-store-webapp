import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';


@Entity('users')
export class User {
  
  
  @PrimaryGeneratedColumn()
  id: number;

  
  
  
  @Index({ unique: true })
  @Column({ length: 120 })
  email: string;

  
  
  @Column({ length: 80 })
  name: string;

  
  
  
  
  @Column({ select: false })
  passwordHash: string;

  
  
  @Column({ default: 'customer' })
  role: string;

  
  
  @CreateDateColumn()
  createdAt: Date;

  
  
  @UpdateDateColumn()
  updatedAt: Date;
}
