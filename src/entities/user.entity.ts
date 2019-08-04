import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  Index,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Training } from './training.entity';

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

  @CreateDateColumn()
  dateCreated: Date;

  @OneToMany(type => Training, trainings => trainings.user, {
    cascade: true,
  })
  @JoinColumn()
  trainings: Training[];
}
