import { Injectable } from '@nestjs/common';
import { CreatePrestationDto } from './dto/create-prestation.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';

@Injectable()
export class PrestationsService {
  create(createPrestationDto: CreatePrestationDto) {
    return 'This action adds a new prestation';
  }

  findAll() {
    return `This action returns all prestations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prestation`;
  }

  update(id: number, updatePrestationDto: UpdatePrestationDto) {
    return `This action updates a #${id} prestation`;
  }

  remove(id: number) {
    return `This action removes a #${id} prestation`;
  }
}
