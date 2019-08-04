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

<<<<<<< HEAD
=======
  @Column('timestamp', {
    nullable: true,
  })
  dateStarted: Date;

  @Column('timestamp', {
    nullable: true,
  })
  dateEnded: Date;

>>>>>>> refactoring
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

<<<<<<< HEAD
=======
  @Column()
  userId: number;

>>>>>>> refactoring
  @ManyToOne(type => User, user => user.trainings)
  user: User;
}
