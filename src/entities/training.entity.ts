import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { History } from './history.entity';
import { User } from './user.entity';

@Entity()
export class Training {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creation_date: Date;

  @OneToMany(type => History, exercises => exercises.training, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  exercises: History[];

  @ManyToOne(type => User, user => user.trainings)
  user: User;
}
