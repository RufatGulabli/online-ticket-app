import { SeatStructure } from 'src/Domains/seats-structure/entity/seat-structure.entity';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Event } from '../../event/entity/event.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  issued: boolean;

  @Column({ name: 'ticket_number' })
  @Generated('uuid')
  ticketNumber: string;

  @Column()
  price: number;

  @ManyToOne(() => Event, (event) => event.tickets)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => SeatStructure, (seat) => seat.ticket)
  @JoinColumn({ name: 'seat_id' })
  seat: SeatStructure;
}
