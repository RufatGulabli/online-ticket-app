import { Body, Controller, ValidationPipe } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entity/reservation.entity';
import { ReservationService } from './reservation.service';
import { PaymentDetails } from 'src/Utils/enums';

@Crud({
  model: {
    type: Reservation
  },
  dto: {
    create: CreateReservationDto
  },
  validation: { always: true }
  // query: {
  //   join: {
  //     address: {
  //       eager: true,
  //       alias: 'address',
  //     },
  //   },
  // },
})
@ApiTags('Reservation')
@Controller('reservation')
export class ReservationController implements CrudController<Reservation> {
  constructor(public service: ReservationService) {}

  @Override('createOneBase')
  async create(
    @Body(ValidationPipe) dto: CreateReservationDto
  ): Promise<Reservation> {
    return await this.service.create(dto);
  }

  @OnEvent('payment')
  async handlePayment(payload: PaymentDetails) {
    try {
      return await this.service.handlePayment(payload);
    } catch (error) {
      throw error;
    }
  }
}
