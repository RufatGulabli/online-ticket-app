import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReservationDto } from 'src/Domains/reservation/dto/create-reservation.dto';
import { Ticket } from 'src/Domains/ticket/entity/ticket.entity';
import { TicketStatus } from 'src/Utils/enums';
import { Repository } from 'typeorm';

@Injectable()
export class isSelectedSeatReserved implements PipeTransform {
  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>
  ) {}

  async transform(dto: CreateReservationDto) {
    for (const customer of dto.customers) {
      const ticket = await this.ticketRepo
        .createQueryBuilder()
        .where('seat_id = :seatId AND concert_id = :concertId', {
          seatId: customer.seatId,
          concertId: dto.concertId
        })
        .getOne();
      if (ticket.issued !== TicketStatus.FREE) {
        throw new BadRequestException(
          `Seat with id ${customer.seatId} has already been reserved. Please choose another seat.`
        );
      }
    }

    return dto;
  }
}
