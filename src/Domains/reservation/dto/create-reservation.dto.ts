import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateCustomerDto } from 'src/Domains/customer/dto/create-customer.dto';

export class CreateReservationDto {
  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  eventId: number;

  @ApiProperty({ type: () => [CreateCustomerDto], minItems: 1, maxItems: 6 })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @Type(() => CreateCustomerDto)
  customers: CreateCustomerDto[];
}
