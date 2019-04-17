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

  @Column('int', {
    default: 0,
  })
  result: number;

  @Column('text', {
    nullable: true,
    array: true,
  })
  rawFrames: string[];

  @ManyToOne(type => Exercise, excercise => excercise.training)
  training: Training;
}
