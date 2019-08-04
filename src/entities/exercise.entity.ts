import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Training } from './training.entity';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column()
  key: string;

  @Column('int')
  count: number;

<<<<<<< HEAD
  @Column('float', {
    nullable: true,
  })
  result: number;

=======
  @Column('int', {
    default: 0,
  })
  result: number;

  @Column('text', {
    nullable: true,
    array: true,
  })
  rawFrames: string[];

>>>>>>> refactoring
  @ManyToOne(type => Exercise, excercise => excercise.training)
  training: Training;
}
