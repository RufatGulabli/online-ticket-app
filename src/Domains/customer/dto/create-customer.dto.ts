import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ minLength: 3, maxLength: 32 })
  @IsString()
  @Length(3, 32)
  firstName: string;

  @ApiProperty({ minLength: 3, maxLength: 32 })
  @IsString()
  @Length(3, 32)
  lastName: string;
}
