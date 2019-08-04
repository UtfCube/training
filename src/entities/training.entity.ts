import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Exercise } from './exercise.entity';

@Entity()
export class Training {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  dateCreated: Date;

  @Column('float', {
    nullable: true,
  })
  score: number;

  @OneToMany(type => Exercise, exercises => exercises.training, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  exercises: Exercise[];

  @ManyToOne(type => User, user => user.trainings)
  user: User;
}
