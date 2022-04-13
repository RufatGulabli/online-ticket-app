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

import { Concert } from '../../concert/entity/concert.entity';
import { Reservation } from '../../reservation/entity/reservation.entity';
import { Customer } from '../../customer/entity/customer.entity';
import { TicketStatus } from 'src/Utils/enums';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.FREE
  })
  issued: TicketStatus;

  @Column({ name: 'ticket_number' })
  @Generated('uuid')
  ticketNumber: string;

  @Column('numeric')
  price: number;

  @ManyToOne(() => Concert, (concert) => concert.tickets)
  @JoinColumn({ name: 'concert_id' })
  concert: Concert;

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
