import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SellingOption, TicketStatus } from 'src/Utils/enums';
import { Repository } from 'typeorm';
import { Ticket } from '../ticket/entity/ticket.entity';

import { SeatStructure } from './entity/seat-structure.entity';

export interface ISeatService {
  getSeats(params: {
    count: number;
    concertid: number;
    option: SellingOption;
  }): Promise<SeatStructure[]>;
}

@Injectable()
export class SeatStructureService implements ISeatService {
  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>
  ) {}

  async getSeats(dto: {
    count: number;
    concertid: number;
    option: SellingOption;
  }): Promise<SeatStructure[]> {
    const { concertid, count, option } = dto;

    const tickets = await this.ticketRepo.find({
      where: { concert: { id: concertid } },
      relations: ['seat'],
      order: { id: 'ASC' }
    });

    if (option === SellingOption.ALL_TOGETHER) {
      return this.getAllTogether(tickets, count);
    } else if (option === SellingOption.EVEN) {
      if (count === 0 || count % 2 !== 0) {
        throw new BadRequestException(
          `For the even option count should be even number. Provided count: ${count}`
        );
      }
      return [];
    } else {
      return this.getAvoidOne(tickets, count);
    }
  }

  private getAllTogether(tickets: Ticket[], count: number) {
    let result: SeatStructure[] = [];
    for (let i = 0; i < tickets.length; ++i) {
      if (result.length === count) {
        break;
      }

      if (
        (tickets[i].seat.lastSeatInRow &&
          result.length < count &&
          result.length !== count - 1) ||
        tickets[i].issued === TicketStatus.TICKETED ||
        tickets[i].issued === TicketStatus.RESERVED
      ) {
        result = [];
        continue;
      } else {
        result.push(tickets[i].seat);
      }
    }
    return result;
  }

  private getAvoidOne(tickets: Ticket[], count: number) {
    const freeSeats = tickets.filter((t) => t.issued === TicketStatus.FREE);
    if (freeSeats.length === count + 1) {
      throw new BadRequestException(
        'This options requires to purchase all seats.'
      );
    } else {
      return freeSeats.slice(0, count).map((t) => t.seat);
    }
  }
}
