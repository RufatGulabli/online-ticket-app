import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { VenueModule } from './Domains/venue/venue.module';
import { ConcertModule } from './Domains/concert/concert.module';
import { ReservationModule } from './Domains/reservation/reservation.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentModule } from './Domains/payments/payment.module';
import { SeatStructureModule } from './Domains/seats-structure/seat-structure.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true
        })
    }),
    EventEmitterModule.forRoot(),
    VenueModule,
    ConcertModule,
    ReservationModule,
    PaymentModule,
    SeatStructureModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
