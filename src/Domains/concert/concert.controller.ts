import { Body, Controller, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override } from '@nestjsx/crud';

import { Concert } from './entity/concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { IsVenueBusyOnThisDate } from '../../Pipes/is-venue-busy.pipe';
import { ConcertService } from './concert.service';

@Crud({
  model: {
    type: Concert
  },
  dto: {
    create: CreateConcertDto
  },
  validation: { always: true }
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
@ApiTags('Concerts')
@Controller('concert')
export class ConcertController implements CrudController<Concert> {
  constructor(public service: ConcertService) {}

  @Override('createOneBase')
  async create(
    req: CrudRequest,
    @Body(ValidationPipe, IsVenueBusyOnThisDate) dto: CreateConcertDto
  ): Promise<Concert> {
    return await this.service.createOne(req, dto);
  }
}
