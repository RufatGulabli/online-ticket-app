import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ minLength: 3, maxLength: 128 })
  @IsString()
  @Length(3, 128)
  name: string;

  @ApiProperty({ format: 'DD.MMM.YYYY:HH.mm' })
  @IsDateString({ minDate: new Date() })
  eventDate: Date;

  @ApiProperty({ minLength: 3, maxLength: 2056 })
  @IsString()
  @Length(3, 2056)
  description: string;

  @ApiProperty({ minimum: 1, maximum: 12 })
  @IsNumber()
  @Min(1)
  @Max(12)
  duration: number;

  @ApiProperty({ minimum: 1, maximum: 999999 })
  @IsNumber()
  @Min(1)
  @Max(9999999)
  price: number;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  venueId: number;
}
