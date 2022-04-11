import { ReservationStatus } from 'src/Utils/enums';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Event } from '../../event/entity/event.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING_PAYMENT,
  })
  status: ReservationStatus;

  @Generated('uuid')
  @Column({ name: 'booking_reference' })
  bookingReference: string;

  @Column('timestamp')
  deadline: Date;

  @ManyToOne(() => Event, (event) => event.reservations)
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
