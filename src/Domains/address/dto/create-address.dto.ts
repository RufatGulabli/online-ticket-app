import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ minLength: 4, maxLength: 64 })
  @IsString()
  @Length(4, 64)
  street: string;

  @ApiProperty({ minLength: 4, maxLength: 8 })
  @IsString()
  @Length(4, 8)
  zip: string;

  @ApiProperty({ minLength: 2, maxLength: 36 })
  @IsString()
  @Length(2, 36)
  city: string;
}
