import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';

import { Venue } from './entity/venue.entity';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Venue
  },
  dto: {
    create: CreateVenueDto
  },
  validation: { always: true },
  query: {
    join: {
      address: { eager: true, alias: 'address' }
    }
  }
})
@ApiTags('Venue')
@Controller('venue')
export class VenueController implements CrudController<Venue> {
  constructor(public service: VenueService) {}
}
