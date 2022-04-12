import { EventEmitter2 } from '@nestjs/event-emitter';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { nanoid } from 'nanoid';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Post()
  makePayment(@Body() { reservationId }: { reservationId: number }) {
    // Imitation of payment request to 3rd parties server
    setTimeout(() => {
      const paymentObject = new CreatePaymentDto();
      paymentObject.status = true;
      paymentObject.createDate = new Date();
      paymentObject.rejectionReason = '';
      paymentObject.transactionNo = nanoid(12);

      // reservation-controller.handlePayment() is listening to this event
      this.eventEmitter.emit('payment', { reservationId, ...paymentObject });
    }, 2000);
    return true;
  }
}
