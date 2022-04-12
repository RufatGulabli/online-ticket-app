import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reservation } from './entity/reservation.entity';
import { Event } from '../event/entity/event.entity';
import { Customer } from '../customer/entity/customer.entity';
import { SeatStructure } from '../seats-structure/entity/seat-structure.entity';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Ticket } from '../ticket/entity/ticket.entity';
import { Payment } from '../payments/entity/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      Customer,
      SeatStructure,
      Event,
      Ticket,
      Payment
    ])
  ],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
