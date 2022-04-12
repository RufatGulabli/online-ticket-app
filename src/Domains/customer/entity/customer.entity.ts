import { Reservation } from 'src/Domains/reservation/entity/reservation.entity';
import { SeatStructure } from 'src/Domains/seats-structure/entity/seat-structure.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => SeatStructure)
  @JoinColumn({ name: 'seat_id' })
  seat: SeatStructure;

  @ManyToOne(() => Reservation, (reservation) => reservation.customers)
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;
}
