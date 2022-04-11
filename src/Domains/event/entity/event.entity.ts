import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Venue } from 'src/Domains/venue/entity/venue.entity';
import { Ticket } from 'src/Domains/ticket/entity/ticket.entity';
import { Reservation } from 'src/Domains/reservation/entity/reservation.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'event_date', type: 'timestamp' })
  eventDate: Date;

  @Column()
  description: string;

  @Column()
  duration: number;

  @ManyToOne(() => Venue, (venue) => venue.events)
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets: Ticket[];

  @OneToMany(() => Reservation, (reservation) => reservation.event)
  reservations: Reservation[];
}
