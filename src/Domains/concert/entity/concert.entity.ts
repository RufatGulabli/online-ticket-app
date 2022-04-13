import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import { Venue } from 'src/Domains/venue/entity/venue.entity';
import { Ticket } from 'src/Domains/ticket/entity/ticket.entity';
import { Reservation } from 'src/Domains/reservation/entity/reservation.entity';

@Entity('concerts')
export class Concert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'concert_date', type: 'timestamp' })
  concertDate: Date;

  @Column()
  description: string;

  @Column()
  duration: number;

  @ManyToOne(() => Venue, (venue) => venue.concerts)
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @OneToMany(() => Ticket, (ticket) => ticket.concert)
  tickets: Ticket[];

  @OneToMany(() => Reservation, (reservation) => reservation.concert)
  reservations: Reservation[];
}
