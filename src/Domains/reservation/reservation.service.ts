import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Override } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { getConnection, Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';

import { Reservation } from './entity/reservation.entity';
import { Event } from '../event/entity/event.entity';
import { Customer } from '../customer/entity/customer.entity';
import { SeatStructure } from '../seats-structure/entity/seat-structure.entity';

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
    private seatRepo: Repository<SeatStructure>
  ) {
    super(reservationRepo);
  }

  @Override('createOneBase')
  async create(dto: CreateReservationDto): Promise<Reservation> {
    return await getConnection().transaction(
      async (transactionalEntityManager) => {
        try {
          const event = await this.eventRepo.findOneOrFail({
            where: { id: dto.eventId }
          });

          // 15 minutes plus Date.now()
          const deadline = new Date(Date.now() + 900000)
          const newReservation = this.reservationRepo.create({ event, deadline });

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
}
