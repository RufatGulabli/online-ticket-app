import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Override } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { getConnection, Repository, UpdateResult } from 'typeorm';
import * as moment from 'moment';

import { Reservation } from './entity/reservation.entity';
import { Event } from '../event/entity/event.entity';
import { Customer } from '../customer/entity/customer.entity';
import { SeatStructure } from '../seats-structure/entity/seat-structure.entity';
import { PaymentDetails, ReservationStatus } from 'src/Utils/enums';
import { Ticket } from '../ticket/entity/ticket.entity';
import { Payment } from '../payments/entity/payment.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService extends TypeOrmCrudService<Reservation> {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    @InjectRepository(SeatStructure)
    private seatRepo: Repository<SeatStructure>,
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>
  ) {
    super(reservationRepo);
  }

  @Override('createOneBase')
  async create(dto: CreateReservationDto): Promise<Reservation> {
    return await getConnection().transaction(
      async (transactionalEntityManager) => {
        try {
          /* 
              Here we can add protection for preventing of duplicate reservations 
              like not to let people to create multiple reservations for the same
              event. Dependant on the business logic, as we have 15 minutes deadline.
           */
          const event = await this.eventRepo.findOneOrFail({
            where: { id: dto.eventId }
          });

          // const isSelectedSeatReserved = await this.ticketRepo
          //   .createQueryBuilder()
          //   .where('seat_id = :seatId AND event_id = :eventId', {seatId: })

          // 15 minutes plus Date.now()
          const deadline = moment(new Date()).add(15, 'minutes');
          const newReservation = this.reservationRepo.create({
            createdAt: new Date(),
            event,
            deadline
          });

          const savedReservation = await transactionalEntityManager.save(
            newReservation
          );

          const customersPromises = dto.customers.map(async (c) => {
            const seat = await this.seatRepo.findOneOrFail({
              where: { id: c.seatId }
            });

            const newCustomer = this.customerRepo.create({
              email: c.email,
              lastName: c.lastName,
              firstName: c.firstName,
              reservation: savedReservation,
              seat
            });
            return transactionalEntityManager.save(newCustomer);
          });

          await Promise.all(customersPromises);

          return savedReservation;
        } catch (err) {
          throw new BadRequestException(err.message);
        }
      }
    );
  }

  async handlePayment(payload: PaymentDetails): Promise<Ticket[]> {
    return await getConnection().transaction(
      async (transactionalEntityManager) => {
        try {
          const {
            reservationId,
            createDate,
            rejectionReason,
            status,
            transactionNo
          } = payload;

          const reservation = await this.reservationRepo
            .createQueryBuilder('res')
            .innerJoinAndSelect('res.customers', 'customer')
            .innerJoinAndSelect('customer.seat', 'seat')
            .innerJoinAndSelect('res.event', 'event')
            .where('res.id = :reservationId', { reservationId })
            .getOne();

          if (!reservation) {
            console.log(`Reservation with ${reservationId} not found.`);
            throw new BadRequestException(
              `Reservation with ${reservationId} not found.`
            );
          }
          if (reservation.status === ReservationStatus.EXPIRED) {
            throw new BadRequestException(
              'Reservation has been expired. Please create new one.'
            );
          } else if (moment(new Date()).isAfter(reservation.deadline)) {
            this.reservationRepo
              .createQueryBuilder()
              .update(Reservation)
              .set({ status: ReservationStatus.EXPIRED })
              .where('id = :reservationId', { reservationId })
              .execute();

            throw new BadRequestException(
              'Reservation has been expired. Please create new one.'
            );
          }

          const tickets = await this.ticketRepo.find({
            where: { event: reservation.event }
          });

          const ticketPromises: Promise<UpdateResult>[] = [];

          for (const customer of reservation.customers) {
            const updatedTicket = transactionalEntityManager
              .createQueryBuilder()
              .update(Ticket)
              .set({
                issued: true,
                customer,
                reservation
              })
              .where('event_id = :eventId AND seat_id = :seatId', {
                eventId: reservation.event.id,
                seatId: customer.seat.id
              })
              .execute();
            ticketPromises.push(updatedTicket);
          }

          await Promise.all(ticketPromises);

          const payment = this.paymentRepo.create({
            createDate,
            rejectionReason,
            status,
            transactionNo,
            amount: reservation.customers.length * tickets[0].price,
            reservation
          });

          await transactionalEntityManager
            .createQueryBuilder()
            .update(Reservation)
            .set({ status: ReservationStatus.APPROVED })
            .where('id = :reservationId', { reservationId })
            .execute();

          await transactionalEntityManager.save(payment);

          return tickets;
        } catch (error) {
          console.log(error.message);
          return [];
        }
      }
    );
  }
}
