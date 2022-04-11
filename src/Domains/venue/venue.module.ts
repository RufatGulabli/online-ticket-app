import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from '../event/entity/event.entity';
import { Address } from '../address/entity/address.entity';
import { Venue } from './entity/venue.entity';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';
import { SeatStructure } from '../seats-structure/entity/seat-structure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, Address, Event, SeatStructure])],
  controllers: [VenueController],
  providers: [VenueService],
})
export class VenueModule {}
