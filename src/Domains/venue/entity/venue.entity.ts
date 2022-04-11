import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Address } from '../../address/entity/address.entity';
import { Event } from '../../event/entity/event.entity';
import { SeatStructure } from '../../seats-structure/entity/seat-structure.entity';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @OneToOne(() => Address, (address) => address.venue)
  address: Address;

  @OneToMany(() => Event, (event) => event.venue)
  events: Event[];

  @OneToMany(() => SeatStructure, (seat) => seat.venue)
  seats: SeatStructure[];
}
