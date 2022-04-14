import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../ticket/entity/ticket.entity';

import { SeatStructure } from './entity/seat-structure.entity';
import { SeatStructureController } from './seat-structure.controller';
import { SeatStructureService } from './seat-structure.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeatStructure, Ticket])],
  controllers: [SeatStructureController],
  providers: [
    SeatStructureService,
    {
      provide: 'ISeatService',
      useClass: SeatStructureService
    }
  ]
})
export class SeatStructureModule {}
