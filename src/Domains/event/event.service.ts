import { DeepPartial, getConnection, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, Override } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { SeatStructure } from '../seats-structure/entity/seat-structure.entity';
import { Venue } from '../venue/entity/venue.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entity/event.entity';
import { Ticket } from '../ticket/entity/ticket.entity';

@Injectable()
export class EventService extends TypeOrmCrudService<Event> {
  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    @InjectRepository(Venue)
    private venueRepo: Repository<Venue>,
    @InjectRepository(SeatStructure)
    private seatRepo: Repository<SeatStructure>,
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
  ) {
    super(eventRepo);
  }

  @Override()
  async createOne(
    req: CrudRequest,
    dto: DeepPartial<CreateEventDto>,
  ): Promise<Event> {
    return await getConnection().transaction(
      async (transactionalEntityManager) => {
        try {
          const newEvent = this.eventRepo.create({
            description: dto.description,
            name: dto.name,
            eventDate: dto.eventDate,
            duration: dto.duration,
          });

          const venue = await this.venueRepo.findOneOrFail({
            where: { id: dto.venueId },
            relations: ['seats', 'events'],
          });

          newEvent.venue = venue;
          const savedEvent = await transactionalEntityManager.save(newEvent);

          const ticketProms: Promise<Ticket>[] = venue.seats.map((seat) => {
            const ticketNumber = Math.ceil(
              Math.random() * 1000000000,
            ).toString();

            const ticket = this.ticketRepo.create({
              issued: false,
              price: dto.price,
              event: savedEvent,
              ticketNumber,
              seat,
            });
            return transactionalEntityManager.save(ticket);
          });

          await Promise.all(ticketProms);

          return savedEvent;
        } catch (exc) {
          throw new BadRequestException(exc.message);
        }
      },
    );
  }
}
