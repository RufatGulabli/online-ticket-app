import { Body, Controller, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override } from '@nestjsx/crud';

import { Event } from './entity/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { IsVenueBusyOnThisDate } from '../../Pipes/is-venue-busy.pipe';
import { EventService } from './event.service';

@Crud({
  model: {
    type: Event,
  },
  dto: {
    create: CreateEventDto,
  },
  validation: { always: true },
  // query: {
  //   join: {
  //     venue: {
  //       persist: ['name'],
  //       eager: true,
  //       required: true,
  //     },
  //   },
  // },
})
@ApiTags('Event')
@Controller('event')
export class EventController implements CrudController<Event> {
  constructor(public service: EventService) {}

  @Override('createOneBase')
  async create(
    req: CrudRequest,
    @Body(ValidationPipe, IsVenueBusyOnThisDate) dto: CreateEventDto,
  ): Promise<Event> {
    return await this.service.createOne(req, dto);
  }
}
