import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Override } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  getConnection,
  In,
  Repository,
  UpdateQueryBuilder,
  UpdateResult
} from 'typeorm';
import * as moment from 'moment';

import { Reservation } from './entity/reservation.entity';
import { Concert } from '../concert/entity/concert.entity';
import { Customer } from '../customer/entity/customer.entity';
import { SeatStructure } from '../seats-structure/entity/seat-structure.entity';
import {
  PaymentDetails,
  ReservationStatus,
  TicketStatus
} from 'src/Utils/enums';
import { Ticket } from '../ticket/entity/ticket.entity';
import { Payment } from '../payments/entity/payment.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService extends TypeOrmCrudService<Reservation> {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,
    @InjectRepository(Concert)
    private concertRepo: Repository<Concert>,
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
          const concert = await this.concertRepo.findOneOrFail({
            where: { id: dto.concertId }
          });

          const deadline = moment(new Date()).add(15, 'minutes').toDate();
          const newReservation = this.reservationRepo.create({
            createdAt: new Date(),
            concert,
            deadline
          });

          const savedReservation = await transactionalEntityManager.save(
            newReservation
          );

          const customerPromises = [];
          const updateTicketPromises = [];
          for (const c of dto.customers) {
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

            const ticket = await this.ticketRepo.findOneOrFail({
              where: { seat, concert }
            });
            ticket.issued = TicketStatus.RESERVED;

            updateTicketPromises.push(transactionalEntityManager.save(ticket));
            customerPromises.push(transactionalEntityManager.save(newCustomer));
          }

          await Promise.all(updateTicketPromises);
          await Promise.all(customerPromises);

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
            .innerJoinAndSelect('res.concert', 'concert')
            .where('res.id = :reservationId', { reservationId })
            .getOne();

          if (!reservation) {
            console.error(`Reservation with ${reservationId} not found.`);
            throw new BadRequestException(
              `Reservation with ${reservationId} not found.`
            );
          }

          if (reservation.status === ReservationStatus.EXPIRED) {
            throw new BadRequestException(
              'Reservation has been expired. Please create new one.'
            );
          } else if (
            moment(new Date()).isAfter(new Date(reservation.deadline))
          ) {
            await this.changeStatusToExpired(reservationId);

            throw new BadRequestException(
              'Reservation has been expired. Please create new one.'
            );
          }

          const tickets = await this.ticketRepo.find({
            where: { concert: reservation.concert }
          });

          const ticketPromises: Promise<UpdateResult>[] = [];

          for (const customer of reservation.customers) {
            const updatedTicket = transactionalEntityManager
              .createQueryBuilder()
              .update(Ticket)
              .set({
                issued: TicketStatus.TICKETED,
                customer,
                reservation
              })
              .where('concert_id = :concertId AND seat_id = :seatId', {
                concertId: reservation.concert.id,
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
        } catch (err) {
          console.log(err.message);
          return [];
        }
      }
    );
  }

  private async changeStatusToExpired(reservationId: number): Promise<void> {
    await this.reservationRepo
      .createQueryBuilder()
      .update(Reservation)
      .set({ status: ReservationStatus.EXPIRED })
      .where('id = :reservationId', { reservationId })
      .execute();

    await this.ticketRepo
      .createQueryBuilder()
      .update(Ticket)
      .set({ issued: TicketStatus.FREE })
      .where('reservation_id = :reservationId', { reservationId })
      .execute();
  }
}
