import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Period {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp')
  dateStarted: Date;

  @Column('timestamp')
  expiryDate: Date;

  @Column('boolean', {
    default: false,
  })
  active: boolean;

  @Column('double precision')
  price: number;

  @Column()
  userId: number;

  @ManyToOne(type => User, user => user.periods, {
    eager: true,
  })
  user: User;
}
