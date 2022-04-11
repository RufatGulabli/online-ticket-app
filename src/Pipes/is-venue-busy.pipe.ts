import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateEventDto } from '../Domains/event/dto/create-event.dto';

@Injectable()
export class IsVenueBusyOnThisDate implements PipeTransform {
  constructor(@InjectRepository(Event) private eventRepo: Repository<Event>) {}

  async transform(dto: CreateEventDto) {
    const event = await this.eventRepo
      .createQueryBuilder()
      .where('venue_id = :venueId AND event_date::date = :dtoDate::date', {
        venueId: dto.venueId,
        dtoDate: dto.eventDate,
      })
      .getOne();

    if (event) {
      throw new BadRequestException(
        'There is another registered event on the same date in this venue.',
      );
    }

    return dto;
  }
}
