import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  Index,
  CreateDateColumn,
  BaseEntity,
  BeforeInsert,
} from 'typeorm';

import { Training } from './training.entity';
import { Period } from './period.entity';

const INITIAL_BALANCE = 1000;

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    unique: true,
  })
  oauthId: string;

  @Index()
  @Column({
    length: 500,
  })
  name: string;

  @Index()
  @Column({
    unique: true,
  })
  email: string;

  @Index()
  @Column()
  nickname: string;

  @Column()
  picture: string;

  @Column('double precision', {
    nullable: false,
    default: 2000,
  })
  balance: number;

  @CreateDateColumn()
  dateCreated: Date;

  @OneToMany(type => Training, trainings => trainings.user, {
    cascade: true,
  })
  @JoinColumn()
  trainings: Training[];

  @OneToMany(type => Period, periods => periods.user, {
    cascade: true,
  })
  @JoinColumn()
  periods: Period[];
}
