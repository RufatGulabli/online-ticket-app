import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Concert } from 'src/Domains/concert/entity/concert.entity';
import { Repository } from 'typeorm';

import { CreateConcertDto } from '../Domains/concert/dto/create-concert.dto';

@Injectable()
export class IsVenueBusyOnThisDate implements PipeTransform {
  constructor(
    @InjectRepository(Concert) private concertRepo: Repository<Concert>
  ) {}

  async transform(dto: CreateConcertDto) {
    const concert = await this.concertRepo
      .createQueryBuilder()
      .where('venue_id = :venueId AND concert_date::date = :dtoDate::date', {
        venueId: dto.venueId,
        dtoDate: dto.concertDate
      })
      .getOne();

    if (concert) {
      throw new BadRequestException(
        'There is another registered concert on the same date in this venue.'
      );
    }

    return dto;
  }
}
