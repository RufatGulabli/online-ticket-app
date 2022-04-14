import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectEntityManager } from '@nestjs/typeorm';
import { GetSeatsParamsDto } from './dto/get-seats-params.dto';

import { SeatStructure } from './entity/seat-structure.entity';
import { ISeatService } from './seat-structure.service';

@ApiTags('Seats')
@Controller('seats')
export class SeatStructureController {
  constructor(
    @Inject('ISeatService') private readonly seatService: ISeatService
  ) {}

  @Get('/')
  public async getEvenSeats(
    @Query() params: GetSeatsParamsDto
  ): Promise<SeatStructure[]> {
    const { concertid, count, option } = params;

    return await this.seatService.getSeats({
      count: parseInt(count),
      concertid: parseInt(concertid),
      option
    });
  }
}
