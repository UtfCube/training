import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
import { History } from './history.entity';
import { Training } from './training.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: true })
  nickname: string;

  @Column({ length: 50 })
  firstname: string;

  @Column({ length: 50 })
  lastname: string;

  @Column({ length: 50, nullable: true })
  email: string;

  @Column('text', { nullable: true })
  avatar: string;

  @Column({ length: 100, nullable: true })
  vk_id: string;

  @Column({ length: 100, nullable: true })
  facebook_id: string;

  @Column({ default: 1000 })
  balance: number;

  @OneToMany(type => Training, trainings => trainings.user, {
    cascade: true,
  })
  @JoinColumn()
  trainings: Training[];
}
