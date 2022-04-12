import { SeatStructure } from 'src/Domains/seats-structure/entity/seat-structure.entity';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { Event } from '../../event/entity/event.entity';
import { Reservation } from '../../reservation/entity/reservation.entity';
import { Customer } from '../../customer/entity/customer.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  issued: boolean;

  @Column({ name: 'ticket_number' })
  @Generated('uuid')
  ticketNumber: string;

  @Column('numeric')
  price: number;

  @ManyToOne(() => Event, (event) => event.tickets)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => SeatStructure, (seat) => seat.ticket)
  @JoinColumn({ name: 'seat_id' })
  seat: SeatStructure;

  @ManyToOne(() => Reservation, (reservation) => reservation.tickets)
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @OneToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
}
