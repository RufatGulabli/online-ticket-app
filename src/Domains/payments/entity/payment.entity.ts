import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { Reservation } from '../../reservation/entity/reservation.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('numeric')
  amount: number;

  @Column()
  status: boolean;

  @Column({ name: 'rejection_reason' })
  rejectionReason: string;

  @Column({ name: 'create_date' })
  createDate: Date;

  @Column({ name: 'transaction_no' })
  transactionNo: string;

  @OneToOne(() => Reservation)
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  // @BeforeInsert()
  // init() {
  //   this.createDate = new Date();
  // }
}
