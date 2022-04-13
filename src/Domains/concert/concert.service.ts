import { DeepPartial, getConnection, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, Override } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { SeatStructure } from '../seats-structure/entity/seat-structure.entity';
import { Venue } from '../venue/entity/venue.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Concert } from './entity/concert.entity';
import { Ticket } from '../ticket/entity/ticket.entity';
import { TicketStatus } from 'src/Utils/enums';

@Injectable()
export class ConcertService extends TypeOrmCrudService<Concert> {
  constructor(
    @InjectRepository(Concert)
    private concertRepo: Repository<Concert>,
    @InjectRepository(Venue)
    private venueRepo: Repository<Venue>,
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>
  ) {
    super(concertRepo);
  }

  @Override()
  async createOne(
    req: CrudRequest,
    dto: DeepPartial<CreateConcertDto>
  ): Promise<Concert> {
    return await getConnection().transaction(
      async (transactionalEntityManager) => {
        try {
          const newConcert = this.concertRepo.create({
            description: dto.description,
            name: dto.name,
            concertDate: dto.concertDate,
            duration: dto.duration
          });

          const venue = await this.venueRepo.findOneOrFail({
            where: { id: dto.venueId },
            relations: ['seats', 'concerts']
          });

          newConcert.venue = venue;
          const savedConcert = await transactionalEntityManager.save(
            newConcert
          );

          const ticketProms: Promise<Ticket>[] = venue.seats.map((seat) => {
            const randNumber = Math.ceil(
              Math.random() * 10000000000
            ).toString();

            const ticketNumber = `${randNumber.slice(0, 2)}-${randNumber.slice(
              3
            )}`;

            const ticket = this.ticketRepo.create({
              issued: TicketStatus.FREE,
              price: dto.price,
              concert: savedConcert,
              ticketNumber,
              seat
            });
            return transactionalEntityManager.save(ticket);
          });

          await Promise.all(ticketProms);

          return savedConcert;
        } catch (exc) {
          throw new BadRequestException(exc.message);
        }
      }
    );
  }
}
