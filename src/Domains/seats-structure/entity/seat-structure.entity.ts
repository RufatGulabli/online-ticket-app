import { Ticket } from 'src/Domains/ticket/entity/ticket.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Venue } from '../../venue/entity/venue.entity';

@Entity('seat_structures')
export class SeatStructure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'row_no' })
  rowNo: number;

  @Column({ name: 'column_no' })
  columnNo: number;

  @Column({ name: 'last_seat_in_row' })
  lastSeatInRow: boolean;

  @Column()
  sign: string;

  @ManyToOne(() => Venue, (venue) => venue.seats)
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @OneToMany(() => Ticket, (ticket) => ticket.seat)
  ticket: Ticket;
}
