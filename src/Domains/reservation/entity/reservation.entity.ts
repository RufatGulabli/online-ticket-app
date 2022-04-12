import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ReservationStatus } from '../../../Utils/enums';
import { Customer } from '../../customer/entity/customer.entity';
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

  @Column({name: 'created_at', type: 'timestamp'})
  createdAt: Date

  @Column({ name: 'booking_reference' })
  @Generated('uuid')
  bookingReference: string;

  @Column('timestamp')
  deadline: Date;

  @ManyToOne(() => Event, (event) => event.reservations)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(() => Customer, (customer) => customer.reservation)
  customers: Customer[];
}
