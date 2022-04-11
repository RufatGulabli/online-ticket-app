import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { SeatStructure } from 'src/Domains/seats-structure/entity/seat-structure.entity';
import { CreateSeatStructureDto } from 'src/Domains/seats-structure/dto/create-seat-structure.dto';

export class CreateVenueDto {
  @ApiProperty({ minLength: 3, maxLength: 64 })
  @IsString()
  @Length(3, 64)
  name: string;

  @ApiProperty({ minimum: 10, maximum: 500 })
  @IsNumber()
  @Min(10)
  @Max(500)
  capacity: number;

  @ApiProperty({ minLength: 3, maxLength: 64 })
  @IsString()
  @Length(3, 64)
  street: string;

  @ApiProperty({ minLength: 3, maxLength: 64 })
  @IsString()
  @Length(3, 64)
  city: string;

  @ApiProperty({ minLength: 4, maxLength: 8 })
  @IsString()
  @Length(4, 8)
  zip: string;

  @ApiProperty({ type: () => [CreateSeatStructureDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @Type(() => CreateSeatStructureDto)
  seats: SeatStructure[];
}
