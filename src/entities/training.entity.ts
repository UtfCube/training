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

  @Column('timestamp', {
    nullable: true,
  })
  dateStarted: Date;

  @Column('timestamp', {
    nullable: true,
  })
  dateEnded: Date;

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

  @Column()
  userId: number;

  @ManyToOne(type => User, user => user.trainings)
  user: User;
}
