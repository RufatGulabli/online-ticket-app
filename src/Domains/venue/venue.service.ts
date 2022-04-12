import { DeepPartial, getConnection, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, Override } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Venue } from './entity/venue.entity';
import { Address } from '../address/entity/address.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { SeatStructure } from '../seats-structure/entity/seat-structure.entity';

@Injectable()
export class VenueService extends TypeOrmCrudService<Venue> {
  constructor(
    @InjectRepository(Venue)
    private venueRepo: Repository<Venue>,
    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
    @InjectRepository(SeatStructure)
    private seatRepo: Repository<SeatStructure>
  ) {
    super(venueRepo);
  }

  @Override()
  async createOne(
    req: CrudRequest,
    dto: DeepPartial<CreateVenueDto>
  ): Promise<Venue> {
    return await getConnection().transaction(
      async (transactionalEntityManager) => {
        try {
          // To prevent of creating addresses with the same ZIP code
          const isUniqueZIP = await this.addressRepo.findOne({
            where: { zip: dto.zip }
          });

          if (isUniqueZIP) {
            throw new BadRequestException(
              `Address with zip code ${dto.zip} is already registered.`
            );
          }

          // To prevent of creating venue with the same name
          const isUniqueVenueName = await this.venueRepo.findOne({
            where: { name: dto.name }
          });

          if (isUniqueVenueName) {
            throw new BadRequestException(
              `Venue with the name '${dto.name}' is already registered.`
            );
          }

          const venue = this.venueRepo.create({
            name: dto.name,
            capacity: dto.capacity
          });

          if (dto.seats.length !== venue.capacity) {
            throw new BadRequestException(
              'Number of seats is not equal to venue capacity.'
            );
          }

          const savedVenue = await transactionalEntityManager.save(venue);

          // Saving all seats in bulk
          const seatsPromises: Promise<SeatStructure>[] = dto.seats.map(
            (s: SeatStructure) => {
              const newSeat = this.seatRepo.create({
                rowNo: s.rowNo,
                columnNo: s.columnNo,
                lastSeatInRow: s.lastSeatInRow,
                sign: `${s.rowNo}${s.columnNo}`,
                venue
              });

              return transactionalEntityManager.save(newSeat);
            }
          );

          await Promise.all(seatsPromises);

          const address = this.addressRepo.create({
            city: dto.city,
            street: dto.street,
            zip: dto.zip,
            venue
          });

          await transactionalEntityManager.save(address);

          return savedVenue;
        } catch (exc) {
          throw new BadRequestException(exc.message);
        }
      }
    );
  }
}
