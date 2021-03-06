import { Concert } from 'src/Domains/concert/entity/concert.entity';
import { Ticket } from 'src/Domains/ticket/entity/ticket.entity';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import { ReservationStatus } from '../../../Utils/enums';
import { Customer } from '../../customer/entity/customer.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING_PAYMENT
  })
  status: ReservationStatus;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'booking_reference' })
  @Generated('uuid')
  bookingReference: string;

  @Column('timestamp')
  deadline: Date;

  @ManyToOne(() => Concert, (concert) => concert.reservations)
  @JoinColumn({ name: 'concert_id' })
  concert: Concert;

  @OneToMany(() => Customer, (customer) => customer.reservation)
  customers: Customer[];

  @OneToMany(() => Ticket, (ticket) => ticket.reservation)
  tickets: Ticket[];
}
