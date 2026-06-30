import { Injectable } from '@nestjs/common';
import { CreateTypesPrestationDto } from './dto/create-types-prestation.dto';
import { UpdateTypesPrestationDto } from './dto/update-types-prestation.dto';

@Injectable()
export class TypesPrestationsService {
  create(createTypesPrestationDto: CreateTypesPrestationDto) {
    return 'This action adds a new typesPrestation';
  }

  findAll() {
    return `This action returns all typesPrestations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} typesPrestation`;
  }

  update(id: number, updateTypesPrestationDto: UpdateTypesPrestationDto) {
    return `This action updates a #${id} typesPrestation`;
  }

  remove(id: number) {
    return `This action removes a #${id} typesPrestation`;
  }
}
