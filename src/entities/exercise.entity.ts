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

  @Column('float', {
    nullable: true,
  })
  result: number;

  @ManyToOne(type => Exercise, excercise => excercise.training)
  training: Training;
}
