import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { VenueModule } from './Domains/venue/venue.module';
import { EventModule } from './Domains/event/event.module';
import { ReservationModule } from './Domains/reservation/reservation.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentModule } from './Domains/payments/payment.module';

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
    EventModule,
    ReservationModule,
    PaymentModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
