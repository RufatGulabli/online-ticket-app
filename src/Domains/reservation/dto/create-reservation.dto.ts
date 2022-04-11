import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class Reservation {
  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  eventId: number;
}
