import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { SellingOption } from 'src/Utils/enums';

export class GetSeatsParamsDto {
  @ApiProperty({ enum: ['even', 'all-together', 'avoid-one'] })
  @IsString()
  @IsEnum(SellingOption)
  option: SellingOption;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  count: string;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  concertid: string;
}
