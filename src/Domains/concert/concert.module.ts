import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Venue } from '../venue/entity/venue.entity';
import { Concert } from './entity/concert.entity';
import { Address } from '../address/entity/address.entity';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';
import { SeatStructure } from '../seats-structure/entity/seat-structure.entity';
import { Ticket } from '../ticket/entity/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address, Venue, Concert, SeatStructure, Ticket])
  ],
  controllers: [ConcertController],
  providers: [ConcertService]
})
export class ConcertModule {}
