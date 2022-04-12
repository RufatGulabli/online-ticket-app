import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Venue } from '../venue/entity/venue.entity';
import { Event } from './entity/event.entity';
import { Address } from '../address/entity/address.entity';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { SeatStructure } from '../seats-structure/entity/seat-structure.entity';
import { Ticket } from '../ticket/entity/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address, Venue, Event, SeatStructure, Ticket])
  ],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}
