import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
  Length,
  Max,
  Min
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  status: boolean;

  @ApiProperty({ minimum: 1, maximum: 9999999 })
  @IsNumber()
  @Min(1)
  @Max(999999)
  amount: number;

  @ApiProperty()
  @IsDateString()
  createDate: Date;

  @ApiProperty({ minLength: 3, maxLength: 128 })
  @IsString()
  @Length(3, 128)
  rejectionReason: string;

  @ApiProperty({ minLength: 3, maxLength: 32 })
  @IsString()
  @Length(3, 32)
  transactionNo: string;
}
