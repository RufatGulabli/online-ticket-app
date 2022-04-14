import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SellingOption } from 'src/Utils/enums';
import { GetSeatsParamsDto } from './dto/get-seats-params.dto';

import { SeatStructure } from './entity/seat-structure.entity';
import { ISeatService, SeatStructureService } from './seat-structure.service';

@ApiTags('Seats')
@Controller('seats')
export class SeatStructureController {
  constructor(private seatService: SeatStructureService) {}

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
