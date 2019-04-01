import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { User } from './user.entity';
import { Exercise } from './exercise.entity';
import { Training } from './training.entity';

@Entity()
export class History {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    repeat_number: number;

    @ManyToOne(type => Exercise, exercise => exercise.history, {
      cascade: true,
      eager: true
    })
    @JoinColumn()
    exercise: Exercise;

    @ManyToOne(type => Training, training => training.exercises)
    training: Training;
}