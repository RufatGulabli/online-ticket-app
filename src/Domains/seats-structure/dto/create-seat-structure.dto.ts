import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsString,
  Length,
  Max,
  Min
} from 'class-validator';

export class CreateSeatStructureDto {
  @ApiProperty({ minimum: 1, maximum: 100 })
  @IsNumber()
  @Min(1)
  @Max(100)
  rowNo: number;

  @ApiProperty({ minLength: 1, maxLength: 1 })
  @IsString()
  @Length(1, 1)
  columnNo: string;

  @ApiProperty()
  @IsBoolean()
  lastSeatInRow: boolean;
}
