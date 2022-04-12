import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ minLength: 3, maxLength: 32 })
  @IsString()
  @Length(3, 32)
  firstName: string;

  @ApiProperty({ minLength: 3, maxLength: 32 })
  @IsString()
  @Length(3, 32)
  lastName: string;

  @ApiProperty({ minLength: 8, maxLength: 128 })
  @IsString()
  @Length(8, 128)
  email: string;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  seatId: number;
}
